import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface EndScreenProps {
  message: string;
  onRestart: () => void;
}

export function EndScreen({ message, onRestart }: EndScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-xl mx-auto text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-chaos-green/10 via-transparent to-chaos-blue/10 pointer-events-none" />
        
        <div className="relative">
          {/* Icon */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl mb-6"
          >
            👋
          </motion.div>

          {/* Message */}
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-foreground font-display mb-8 leading-relaxed"
          >
            {message}
          </motion.p>

          {/* Restart button */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              variant="outline"
              size="lg"
              onClick={onRestart}
              className="min-w-[200px]"
            >
              Start fresh chaos
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
