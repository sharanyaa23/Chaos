import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface MicroGameMazeProps {
  onComplete: () => void;
  onExit: () => void;
}

// Simple 5x5 maze
const MAZE = [
  [0, 1, 0, 0, 0],
  [0, 1, 0, 1, 0],
  [0, 0, 0, 1, 0],
  [1, 1, 0, 0, 0],
  [0, 0, 0, 1, 0],
];

const START = { x: 0, y: 0 };
const END = { x: 4, y: 4 };

export function MicroGameMaze({ onComplete, onExit }: MicroGameMazeProps) {
  const [position, setPosition] = useState(START);
  const [solved, setSolved] = useState(false);

  const move = useCallback((dx: number, dy: number) => {
    const newX = position.x + dx;
    const newY = position.y + dy;

    // Check bounds
    if (newX < 0 || newX > 4 || newY < 0 || newY > 4) return;
    // Check wall
    if (MAZE[newY][newX] === 1) return;

    setPosition({ x: newX, y: newY });

    // Check win
    if (newX === END.x && newY === END.y) {
      setSolved(true);
    }
  }, [position]);

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

        <p className="text-chaos-pink font-mono text-xs uppercase tracking-wider mb-2">
          Chaos Streak Bonus
        </p>
        <h2 className="text-xl font-display font-bold text-foreground mb-4">
          Quick Break
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          You've been making very bad choices consistently.<br />
          Can you still think?
        </p>

        {solved ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <p className="text-chaos-green font-display text-lg mb-4">Nice! Brain still works.</p>
            <Button variant="chaosGreen" onClick={onComplete} className="w-full">
              Back to chaos
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Maze grid */}
            <div className="flex justify-center mb-4">
              <div className="grid grid-cols-5 gap-1 p-2 bg-muted/30 rounded-lg">
                {MAZE.map((row, y) =>
                  row.map((cell, x) => {
                    const isPlayer = position.x === x && position.y === y;
                    const isStart = x === START.x && y === START.y;
                    const isEnd = x === END.x && y === END.y;
                    const isWall = cell === 1;

                    return (
                      <div
                        key={`${x}-${y}`}
                        className={`w-8 h-8 rounded flex items-center justify-center text-sm ${
                          isWall
                            ? 'bg-muted'
                            : isPlayer
                            ? 'bg-chaos-pink'
                            : isEnd
                            ? 'bg-chaos-green/30 border border-chaos-green'
                            : isStart
                            ? 'bg-chaos-blue/30'
                            : 'bg-card border border-border'
                        }`}
                      >
                        {isPlayer && '●'}
                        {isEnd && !isPlayer && '★'}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-1 mb-4">
              <Button variant="ghost" size="sm" onClick={() => move(0, -1)} className="w-10 h-10">
                ↑
              </Button>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => move(-1, 0)} className="w-10 h-10">
                  ←
                </Button>
                <Button variant="ghost" size="sm" onClick={() => move(0, 1)} className="w-10 h-10">
                  ↓
                </Button>
                <Button variant="ghost" size="sm" onClick={() => move(1, 0)} className="w-10 h-10">
                  →
                </Button>
              </div>
            </div>

            <Button variant="outline" onClick={onComplete} className="w-full">
              Skip, continue chaos
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
}
