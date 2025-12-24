import { motion } from 'framer-motion';

interface ChaosCardProps {
  situation: string;
  choices: string[];
  onSelect: (choiceIndex: number) => void;
  level: number;
}

const levelLabels = ['Small Chaos', 'Medium Chaos', 'Full Chaos'];
const levelColors = ['text-chaos-green', 'text-chaos-yellow', 'text-chaos-pink'];
const optionLabels = ['A', 'B', 'C'];

export function ChaosCard({ situation, choices, onSelect, level }: ChaosCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-chaos-pink/5 via-transparent to-chaos-blue/5 pointer-events-none" />
        
        {/* Level indicator */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <span className={`text-xs font-mono uppercase tracking-wider ${levelColors[level]} opacity-80`}>
            {levelLabels[level]}
          </span>
        </motion.div>

        {/* Situation */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl leading-relaxed text-foreground mb-4 font-display"
        >
          {situation}
        </motion.p>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-sm text-muted-foreground font-mono mb-8 italic"
        >
          One option is worse than the others. Choose wisely.
        </motion.p>

        {/* Choices */}
        <div className="space-y-3">
          {choices.map((choice, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <button
                onClick={() => onSelect(index)}
                className="w-full flex items-start gap-4 p-4 bg-muted/30 hover:bg-muted/50 border border-border hover:border-chaos-pink/50 rounded-xl transition-all duration-200 text-left group"
              >
                {/* Option label */}
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-muted rounded-lg font-mono text-sm text-muted-foreground group-hover:text-chaos-pink group-hover:bg-chaos-pink/20 transition-colors">
                  {optionLabels[index]}
                </span>
                {/* Option text - wraps naturally */}
                <span className="flex-1 text-foreground font-display leading-relaxed break-words">
                  {choice}
                </span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
