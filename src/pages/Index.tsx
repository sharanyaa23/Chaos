import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { StartScreen } from '@/components/StartScreen';
import { ChaosCard } from '@/components/ChaosCard';
import { OutcomeCard } from '@/components/OutcomeCard';
import { ReminderModal } from '@/components/ReminderModal';
import { EndScreen } from '@/components/EndScreen';
import { LoadingState } from '@/components/LoadingState';
import { MicroGameMaze } from '@/components/MicroGameMaze';
import { MicroGameWord } from '@/components/MicroGameWord';
import { useChaos } from '@/hooks/useChaos';

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const {
    chaos,
    gameState,
    isLoading,
    showOutcome,
    selectedChoice,
    sensibleChoice,
    chaoticChoice,
    pickedChaotic,
    currentReaction,
    selectChoice,
    nextChaos,
    startGame,
    handleReminderChoice,
    handleMicroGameComplete,
    exitGame,
    resetGame,
  } = useChaos();

  const handleStart = (level: number) => {
    setGameStarted(true);
    startGame(level);
  };

  const handleRestart = () => {
    resetGame();
    setGameStarted(false);
  };

  // Show start screen
  if (!gameStarted) {
    return <StartScreen onStart={handleStart} />;
  }

  // Show end screen
  if (gameState.gameEnded && gameState.endMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <EndScreen message={gameState.endMessage} onRestart={handleRestart} />
      </div>
    );
  }

  // Show micro-game if triggered
  if (gameState.showMicroGame && showOutcome) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {gameState.showMicroGame === 'maze' ? (
            <MicroGameMaze 
              key="maze" 
              onComplete={() => handleMicroGameComplete('maze')} 
              onExit={exitGame}
            />
          ) : (
            <MicroGameWord 
              key="word" 
              onComplete={() => handleMicroGameComplete('word')} 
              onExit={exitGame}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-chaos-pink/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-chaos-blue/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          <h1 className="text-xl font-display font-bold text-gradient">CHAOS</h1>
          <div className="flex items-center gap-4">
            {gameState.chaosStreak > 0 && (
              <span className="text-xs font-mono text-chaos-pink">
                🔥 {gameState.chaosStreak}
              </span>
            )}
            <span className="text-xs font-mono text-muted-foreground">
              Round {gameState.playCount + 1}
            </span>
            {/* Exit button */}
            <button
              onClick={exitGame}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Exit game"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingState key="loading" />
          ) : chaos && !showOutcome ? (
            <ChaosCard
              key={`chaos-${chaos.situationId}`}
              situation={chaos.situation}
              choices={chaos.choices}
              onSelect={selectChoice}
              level={gameState.currentLevel}
            />
          ) : chaos && showOutcome && selectedChoice ? (
            <OutcomeCard
              key={`outcome-${chaos.situationId}`}
              chaoticChoice={chaoticChoice}
              sensibleChoice={sensibleChoice}
              selectedChoice={selectedChoice}
              outcome={chaos.outcome}
              reaction={currentReaction}
              pickedChaotic={pickedChaotic}
              onNext={nextChaos}
            />
          ) : null}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-xs text-muted-foreground/50 font-mono">
          Built for fun. Play irresponsibly.
        </p>
      </footer>

      {/* Reminder Modal */}
      <ReminderModal
        isOpen={gameState.showReminder}
        onChoice={handleReminderChoice}
      />
    </div>
  );
};

export default Index;
