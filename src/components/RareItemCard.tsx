import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RareItemCardProps {
  children: ReactNode;
  isRare: boolean;
  className?: string;
}

/**
 * Wrapper component that adds stunning golden glow animations to rare items
 */
export const RareItemCard: React.FC<RareItemCardProps> = ({
  children,
  isRare,
  className = '',
}) => {

  if (!isRare) {
    return <div className={className}>{children}</div>;
  }


  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      animate={{
        boxShadow: [
          '0 0 20px rgba(251, 191, 36, 0.8)',
          '0 0 50px rgba(251, 191, 36, 1)',
          '0 0 20px rgba(251, 191, 36, 0.8)',
        ],
        scale: [1, 1.03, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* Inner golden gradient background */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(251, 191, 36, 0.3) 0%, rgba(251, 191, 36, 0.15) 50%, rgba(251, 191, 36, 0.05) 100%)',
        }}
        animate={{
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Pulsing radial glow from center */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(251, 191, 36, 0.4) 0%, transparent 70%)',
        }}
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Diagonal light sweep animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(251, 191, 36, 0.6) 50%, transparent 70%)',
          width: '200%',
          height: '200%',
          top: '-50%',
          left: '-100%',
        }}
        animate={{
          left: ['-100%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 1,
        }}
      />

      {/* Edge shimmer - top and bottom */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.8), transparent)',
        }}
        animate={{
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.8), transparent)',
        }}
        animate={{
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-amber-300 rounded-full pointer-events-none"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [-20, -40, -20],
            x: [0, (i % 2 === 0 ? 10 : -10), 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.4,
          }}
        />
      ))}

      {/* Enhanced golden border with double layer */}
      <div className="absolute inset-0 rounded-lg border-2 border-amber-400 pointer-events-none" />
      <motion.div
        className="absolute inset-0 rounded-lg border-2 border-amber-300 pointer-events-none"
        animate={{
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Multiple sparkle effects */}
      <motion.div
        className="absolute -top-1 -right-1 text-xl pointer-events-none z-10"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        ✨
      </motion.div>

      <motion.div
        className="absolute -top-1 -left-1 text-lg pointer-events-none z-10"
        animate={{
          rotate: [360, 0],
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      >
        ⭐
      </motion.div>

      <motion.div
        className="absolute -bottom-1 -right-1 text-sm pointer-events-none z-10"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      >
        💫
      </motion.div>

      {children}
    </motion.div>
  );
};

