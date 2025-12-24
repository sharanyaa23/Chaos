import { motion } from 'framer-motion';

export function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Animated background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-chaos-pink/20 via-chaos-purple/20 to-chaos-blue/20"
          animate={{ 
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        <div className="relative text-center">
          {/* Loading icon */}
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
            }}
            className="text-4xl mb-6"
          >
            🌀
          </motion.div>

          {/* Loading text */}
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-muted-foreground font-mono text-sm"
          >
            Summoning chaos...
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
