import { motion } from 'framer-motion';

interface StartScreenProps {
  onStart: (level: number) => void;
}

const levelOptions = [
  {
    level: 0,
    name: 'Small Chaos',
    description: 'Small everyday mistakes',
  },
  {
    level: 1,
    name: 'Medium Chaos',
    description: 'Things start going wrong',
  },
  {
    level: 2,
    name: 'Full Chaos',
    description: 'Nothing goes right',
  },
];

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center min-h-screen p-6"
    >
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-chaos-pink/20 rounded-full blur-[128px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chaos-blue/20 rounded-full blur-[128px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center w-full max-w-sm">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-6xl md:text-8xl font-display font-bold text-gradient mb-4 tracking-tight">
            CHAOS
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl md:text-2xl text-muted-foreground font-display mb-12"
        >
          Bad decisions win.
        </motion.p>

        {/* Question */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-lg text-foreground font-display mb-8"
        >
          How much chaos do you want today?
        </motion.p>

        {/* Level options - centered column with equal width */}
        <div className="flex flex-col items-center gap-4 mb-10">
          {levelOptions.map((option, index) => (
            <motion.button
              key={option.level}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              onClick={() => onStart(option.level)}
              className="w-full max-w-xs p-4 bg-card border border-border hover:border-chaos-pink/50 rounded-xl transition-all duration-200 text-center group hover:bg-muted/30"
            >
              <span className="block font-display font-bold text-foreground group-hover:text-chaos-pink transition-colors">
                {option.name}
              </span>
              <span className="block text-sm text-muted-foreground mt-1">
                {option.description}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="text-xs text-muted-foreground/50 font-mono mt-16"
        >
          Built for fun. Play irresponsibly.
        </motion.p>
      </div>
    </motion.div>
  );
}
