import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface MicroGameWordProps {
  onComplete: () => void;
  onExit: () => void;
}

const WORDS = [
  { word: 'CHAOS', hint: 'What this game is about' },
  { word: 'MESS', hint: 'Things are getting...' },
  { word: 'OOPS', hint: 'What you say after a mistake' },
  { word: 'YOLO', hint: 'You only live once' },
  { word: 'WILD', hint: 'Not tame' },
  { word: 'BOLD', hint: 'Brave and confident' },
  { word: 'RISK', hint: 'Danger or chance' },
];

export function MicroGameWord({ onComplete, onExit }: MicroGameWordProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  const puzzle = useMemo(() => {
    const correct = WORDS[Math.floor(Math.random() * WORDS.length)];
    const otherWords = WORDS.filter(w => w.word !== correct.word);
    const shuffled = otherWords.sort(() => Math.random() - 0.5).slice(0, 2);
    const options = [correct, ...shuffled].sort(() => Math.random() - 0.5);
    return { correct, options };
  }, []);

  const handleSelect = (word: string) => {
    setSelected(word);
    setResult(word === puzzle.correct.word ? 'correct' : 'wrong');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full max-w-sm mx-auto"
    >
      <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl text-center relative">
        {/* Exit button */}
        <button
          onClick={onExit}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Exit game"
        >
          <X className="w-5 h-5" />
        </button>

        <p className="text-chaos-purple font-mono text-xs uppercase tracking-wider mb-2">
          Chaos Master Check
        </p>
        <h2 className="text-xl font-display font-bold text-foreground mb-4">
          Guess the Word
        </h2>
        <p className="text-muted-foreground text-sm mb-2">
          You're doing too well at being chaotic.
        </p>
        <p className="text-muted-foreground text-sm mb-6">
          Guess this or don't. We don't care.
        </p>

        {/* Hint */}
        <div className="bg-muted/30 rounded-lg p-3 mb-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Hint</p>
          <p className="text-foreground font-display">{puzzle.correct.hint}</p>
        </div>

        {result ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            {result === 'correct' ? (
              <p className="text-chaos-green font-display text-lg mb-4">Correct! Still sharp.</p>
            ) : (
              <p className="text-chaos-pink font-display text-lg mb-4">
                Nope! It was "{puzzle.correct.word}". Chaos has consumed you.
              </p>
            )}
            <Button 
              variant={result === 'correct' ? 'chaosGreen' : 'chaosPink'} 
              onClick={onComplete} 
              className="w-full"
            >
              Back to chaos
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Options */}
            <div className="space-y-2 mb-4">
              {puzzle.options.map((option) => (
                <Button
                  key={option.word}
                  variant="outline"
                  onClick={() => handleSelect(option.word)}
                  className="w-full"
                >
                  {option.word}
                </Button>
              ))}
            </div>

            <Button variant="ghost" onClick={onComplete} className="w-full text-muted-foreground">
              Skip, continue chaos
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
}
