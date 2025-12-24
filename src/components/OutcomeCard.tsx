import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface OutcomeCardProps {
  chaoticChoice: string | null;
  sensibleChoice: string | null;
  selectedChoice: string;
  outcome: string;
  reaction: string;
  pickedChaotic: boolean;
  onNext: () => void;
}

export function OutcomeCard({ 
  chaoticChoice, 
  sensibleChoice, 
  selectedChoice, 
  outcome, 
  reaction, 
  pickedChaotic, 
  onNext 
}: OutcomeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div 
          className={`absolute inset-0 pointer-events-none ${
            pickedChaotic 
              ? 'bg-gradient-to-br from-chaos-pink/10 via-transparent to-chaos-purple/10' 
              : 'bg-gradient-to-br from-muted/20 via-transparent to-muted/10'
          }`} 
        />
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 text-center"
        >
          {pickedChaotic ? (
            <span className="inline-flex items-center gap-2 text-chaos-pink font-mono text-sm uppercase tracking-wider">
              <span className="animate-pulse">✦</span>
              Maximum Chaos Achieved
              <span className="animate-pulse">✦</span>
            </span>
          ) : (
            <span className="text-muted-foreground font-mono text-sm uppercase tracking-wider">
              You played it safe...
            </span>
          )}
        </motion.div>

        {/* Section 1: The Chaotic Choice (Correct Answer) - ALWAYS SHOWN */}
        {chaoticChoice && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4 p-4 bg-chaos-pink/10 rounded-xl border border-chaos-pink/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">😈</span>
              <span className="text-xs text-chaos-pink font-mono uppercase tracking-wider">
                The Chaotic Choice (Correct Answer)
              </span>
            </div>
            <p className="text-foreground font-display leading-relaxed pl-7">
              {chaoticChoice}
            </p>
          </motion.div>
        )}

        {/* Section 2: The Sensible Choice */}
        {sensibleChoice && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-4 p-4 bg-chaos-green/10 rounded-xl border border-chaos-green/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🧠</span>
              <span className="text-xs text-chaos-green font-mono uppercase tracking-wider">
                The Sensible Choice
              </span>
            </div>
            <p className="text-foreground font-display leading-relaxed pl-7">
              {sensibleChoice}
            </p>
          </motion.div>
        )}

        {/* Section 3: Your Choice */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className={`mb-4 p-4 rounded-xl border ${
            pickedChaotic 
              ? 'bg-chaos-purple/10 border-chaos-purple/30' 
              : 'bg-muted/30 border-border'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">👆</span>
            <span className={`text-xs font-mono uppercase tracking-wider ${pickedChaotic ? 'text-chaos-purple' : 'text-muted-foreground'}`}>
              Your Choice
            </span>
          </div>
          <p className="text-foreground font-display leading-relaxed pl-7">
            {selectedChoice}
          </p>
        </motion.div>

        {/* Section 4: What Happened */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6 p-4 bg-chaos-blue/10 rounded-xl border border-chaos-blue/30"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🌀</span>
            <span className="text-xs text-chaos-blue font-mono uppercase tracking-wider">
              What Happened
            </span>
          </div>
          <p className="text-lg leading-relaxed text-foreground font-display pl-7">
            {pickedChaotic ? outcome : "You played it safe. The chaos gods are unimpressed. Nothing interesting happened."}
          </p>
        </motion.div>

        {/* Micro-feedback reaction */}
        {reaction && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-sm text-muted-foreground font-mono mb-6 italic"
          >
            "{reaction}"
          </motion.p>
        )}

        {/* Next button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            variant={pickedChaotic ? "chaosPink" : "outline"}
            size="lg"
            onClick={onNext}
            className="w-full"
          >
            Next bad decision →
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
