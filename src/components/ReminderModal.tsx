import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ReminderModalProps {
  isOpen: boolean;
  onChoice: (choice: 'oneMore' | 'leave' | 'stay') => void;
}

export function ReminderModal({ isOpen, onChoice }: ReminderModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-chaos-yellow/10 via-transparent to-chaos-pink/10 pointer-events-none" />
              
              <div className="relative">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-4xl mb-6 text-center"
                >
                  ⚡
                </motion.div>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-xl font-display font-bold text-foreground mb-4">
                    You've caused enough chaos for now.
                  </h2>
                  <p className="text-muted-foreground font-display">
                    If you have something to do, maybe go do one small thing.
                  </p>
                  <p className="text-muted-foreground font-display mt-2">
                    If not… honestly, fair enough.
                  </p>
                </motion.div>

                {/* Buttons */}
                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      variant="chaosGreen"
                      size="lg"
                      onClick={() => onChoice('oneMore')}
                      className="w-full"
                    >
                      One more, then I go
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => onChoice('leave')}
                      className="w-full"
                    >
                      I'll be back
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button
                      variant="chaosBlue"
                      size="lg"
                      onClick={() => onChoice('stay')}
                      className="w-full"
                    >
                      No work to do
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
