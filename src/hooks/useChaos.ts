import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ChaosState {
  situation: string;
  choices: string[];
  chaoticIndex: number;
  sensibleIndex: number;
  outcome: string;
  situationId: string;
}

export interface GameState {
  playCount: number;
  currentLevel: number;
  startingLevel: number;
  seenSituations: string[];
  showReminder: boolean;
  oneMoreMode: boolean;
  gameEnded: boolean;
  endMessage: string | null;
  chaosStreak: number;
  showMicroGame: 'maze' | 'word' | null;
  lastMicroGame: 'maze' | 'word' | null; // Track last micro-game to prevent back-to-back
}

// Micro-feedback reactions
const reactions = [
  "Bold choice.",
  "Interesting strategy.",
  "That was… a decision.",
  "You really committed.",
  "No regrets, right?",
  "Chaos approved.",
  "Peak performance.",
  "Living dangerously.",
  "You really went for it.",
];

// Friendly exit quotes
export const exitQuotes = [
  "You can come back anytime.",
  "Enough chaos for one day.",
  "Go do something. Or don't.",
  "This was fun. Be responsible-ish.",
  "Chaos will wait.",
  "Take care of yourself, chaos agent.",
  "The bad decisions will still be here.",
  "Rest up. Tomorrow brings fresh chaos.",
];

export function useChaos() {
  const [chaos, setChaos] = useState<ChaosState | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    playCount: 0,
    currentLevel: 0,
    startingLevel: 0,
    seenSituations: [],
    showReminder: false,
    oneMoreMode: false,
    gameEnded: false,
    endMessage: null,
    chaosStreak: 0,
    showMicroGame: null,
    lastMicroGame: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showOutcome, setShowOutcome] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentReaction, setCurrentReaction] = useState<string>('');

  const getLevel = useCallback((playCount: number, startingLevel: number): number => {
    const baseLevel = startingLevel;
    if (playCount < 5) return Math.max(baseLevel, 0);
    if (playCount < 12) return Math.max(baseLevel, 1);
    return 2;
  }, []);

  const getRandomReaction = useCallback(() => {
    return reactions[Math.floor(Math.random() * reactions.length)];
  }, []);

  const getRandomExitQuote = useCallback(() => {
    return exitQuotes[Math.floor(Math.random() * exitQuotes.length)];
  }, []);

  const generateChaos = useCallback(async (level?: number) => {
    setIsLoading(true);
    setShowOutcome(false);
    setSelectedIndex(null);
    setCurrentReaction('');

    try {
      const chaosLevel = level ?? getLevel(gameState.playCount, gameState.startingLevel);
      
      const { data, error } = await supabase.functions.invoke('generate-chaos', {
        body: { 
          level: chaosLevel, 
          seenSituations: gameState.seenSituations 
        },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // ALWAYS normalize choices to plain strings (never objects)
      const normalizedChoices: string[] = data.choices.map((c: unknown) => {
        if (typeof c === 'string') return c;
        if (c && typeof c === 'object' && 'text' in c) return String((c as { text: string }).text);
        return String(c);
      });

      // Normalize indices (handle both old and new formats)
      let chaoticIdx = data.chaoticIndex ?? -1;
      let sensibleIdx = data.sensibleIndex ?? -1;
      
      // Fallback for old format with isWorst/isCorrect on choice objects
      if (chaoticIdx === -1 && Array.isArray(data.choices)) {
        chaoticIdx = data.choices.findIndex((c: unknown) => typeof c === 'object' && c !== null && (c as { isWorst?: boolean }).isWorst);
        if (chaoticIdx === -1) chaoticIdx = 0;
      }
      if (sensibleIdx === -1 && Array.isArray(data.choices)) {
        sensibleIdx = data.choices.findIndex((c: unknown) => typeof c === 'object' && c !== null && (c as { isCorrect?: boolean }).isCorrect);
        if (sensibleIdx === -1) sensibleIdx = 1;
      }

      const normalizedData: ChaosState = {
        situation: data.situation,
        choices: normalizedChoices,
        chaoticIndex: chaoticIdx,
        sensibleIndex: sensibleIdx,
        outcome: data.outcome,
        situationId: data.situationId,
      };

      setChaos(normalizedData);
      setGameState(prev => ({
        ...prev,
        currentLevel: chaosLevel,
        seenSituations: [...prev.seenSituations, normalizedData.situationId],
        showMicroGame: null,
      }));
    } catch (error) {
      console.error('Failed to generate chaos:', error);
      toast({
        title: "Chaos overload",
        description: error instanceof Error ? error.message : "Failed to summon chaos. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [gameState.playCount, gameState.seenSituations, gameState.startingLevel, getLevel]);

  const selectChoice = useCallback((choiceIndex: number) => {
    if (!chaos) return;
    
    setSelectedIndex(choiceIndex);
    setShowOutcome(true);
    setCurrentReaction(getRandomReaction());
    
    const newPlayCount = gameState.playCount + 1;
    // User picked chaos if their index matches the chaotic index
    const pickedChaotic = choiceIndex === chaos.chaoticIndex;
    
    // STREAK LOGIC:
    // - Increment only when user picks chaotic option
    // - Reset when user picks non-chaotic (sensible/other)
    // - Reset after maze game (handled in handleMicroGameComplete)
    const newStreak = pickedChaotic ? gameState.chaosStreak + 1 : 0;
    
    setGameState(prev => {
      const shouldShowReminder = newPlayCount >= 20 && !prev.showReminder && !prev.oneMoreMode;
      
      // MICRO-GAME TRIGGER LOGIC:
      let microGame: 'maze' | 'word' | null = null;
      
      // Never show micro-games back-to-back
      if (prev.lastMicroGame === null || prev.lastMicroGame !== 'maze') {
        // MAZE: At multiples of 5 streak (5, 10, 15...) with 50% probability
        if (newStreak > 0 && newStreak % 5 === 0 && Math.random() < 0.5) {
          microGame = 'maze';
        }
      }
      
      // WORD: Random surprise when streak is under multiples of 10 (0-9, 10-19, etc.)
      // Only if not already triggering maze
      if (microGame === null && prev.lastMicroGame !== 'word') {
        // Streak is NOT at a multiple of 10 threshold
        const streakUnder10Threshold = newStreak % 10 !== 0;
        if (streakUnder10Threshold && Math.random() < 0.12) { // ~12% chance
          microGame = 'word';
        }
      }
      
      if (prev.oneMoreMode) {
        return {
          ...prev,
          playCount: newPlayCount,
          chaosStreak: newStreak,
          gameEnded: true,
          endMessage: "You honored your word. That's rare around here. See you next time, chaos agent.",
        };
      }
      
      return {
        ...prev,
        playCount: newPlayCount,
        chaosStreak: newStreak,
        showReminder: shouldShowReminder,
        showMicroGame: microGame,
      };
    });
  }, [chaos, gameState.playCount, gameState.chaosStreak, gameState.oneMoreMode, getRandomReaction]);

  const handleReminderChoice = useCallback((choice: 'oneMore' | 'leave' | 'stay') => {
    setGameState(prev => ({
      ...prev,
      showReminder: false,
    }));

    switch (choice) {
      case 'oneMore':
        setGameState(prev => ({
          ...prev,
          oneMoreMode: true,
        }));
        generateChaos();
        break;
      case 'leave':
        setGameState(prev => ({
          ...prev,
          gameEnded: true,
          endMessage: "See you soon, chaos agent. The bad decisions will be waiting.",
        }));
        break;
      case 'stay':
        generateChaos();
        break;
    }
  }, [generateChaos]);

  const handleMicroGameComplete = useCallback((gameType: 'maze' | 'word') => {
    setGameState(prev => {
      // MAZE resets streak; WORD does not
      const newStreak = gameType === 'maze' ? 0 : prev.chaosStreak;
      
      return {
        ...prev,
        showMicroGame: null,
        lastMicroGame: gameType,
        chaosStreak: newStreak,
      };
    });
    generateChaos();
  }, [generateChaos]);

  const exitGame = useCallback(() => {
    const quote = getRandomExitQuote();
    setGameState(prev => ({
      ...prev,
      gameEnded: true,
      endMessage: quote,
      showMicroGame: null,
    }));
  }, [getRandomExitQuote]);

  const nextChaos = useCallback(() => {
    if (gameState.gameEnded) return;
    
    // If there's a micro-game pending, show it
    if (gameState.showMicroGame) {
      return; // Don't proceed, show micro-game instead
    }
    
    generateChaos();
  }, [gameState.gameEnded, gameState.showMicroGame, generateChaos]);

  const startGame = useCallback((startingLevel: number) => {
    setGameState(prev => ({
      ...prev,
      startingLevel,
      currentLevel: startingLevel,
    }));
    generateChaos(startingLevel);
  }, [generateChaos]);

  const resetGame = useCallback(() => {
    setGameState({
      playCount: 0,
      currentLevel: 0,
      startingLevel: 0,
      seenSituations: [],
      showReminder: false,
      oneMoreMode: false,
      gameEnded: false,
      endMessage: null,
      chaosStreak: 0,
      showMicroGame: null,
      lastMicroGame: null,
    });
    setChaos(null);
    setShowOutcome(false);
    setSelectedIndex(null);
    setCurrentReaction('');
  }, []);

  // Derived values for easy access
  const selectedChoice = selectedIndex !== null && chaos ? chaos.choices[selectedIndex] : null;
  const sensibleChoice = chaos ? chaos.choices[chaos.sensibleIndex] : null;
  const chaoticChoice = chaos ? chaos.choices[chaos.chaoticIndex] : null;
  const pickedChaotic = selectedIndex !== null && chaos ? selectedIndex === chaos.chaoticIndex : false;

  return {
    chaos,
    gameState,
    isLoading,
    showOutcome,
    selectedIndex,
    selectedChoice,
    sensibleChoice,
    chaoticChoice,
    pickedChaotic,
    currentReaction,
    generateChaos,
    selectChoice,
    nextChaos,
    startGame,
    handleReminderChoice,
    handleMicroGameComplete,
    exitGame,
    resetGame,
  };
}
