import { memo } from 'react';
import { motion } from 'framer-motion';
import { classNames } from '~/utils/classNames';

interface PanelHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export const PanelHeader = memo(({ className, children }: PanelHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0.7, backgroundColor: 'rgba(128, 0, 128, 0.1)' }}
      animate={{
        opacity: 1,
        backgroundColor: 'rgba(128, 0, 128, 0.2)',
        transition: { duration: 0.3 }
      }}
      whileHover={{
        backgroundColor: 'rgba(128, 0, 128, 0.3)',
        transition: { duration: 0.2 }
      }}
      className={classNames(
        'relative flex items-center gap-2 text-purple-300 border-b border-purple-900/50 px-4 py-1 min-h-[34px] text-sm',
        'bg-gradient-to-r from-black via-purple-950 to-black', // Gradient background
        'shadow-[0_2px_5px_rgba(128,0,128,0.2)]', // Subtle purple shadow
        'transition-all duration-300 ease-in-out', // Smooth transitions
        className
      )}
    >
      {/* Subtle animated border effect */}
      <div
        className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-purple-700 to-transparent 
        animate-pulse opacity-50"
      />

      {children}
    </motion.div>
  );
});