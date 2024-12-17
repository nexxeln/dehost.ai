import { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingDotsProps {
  text: string;
}

export const LoadingDots = memo(({ text }: LoadingDotsProps) => {
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLineCount((prevLineCount) => (prevLineCount + 1) % 4);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const lineVariants = {
    hidden: {
      width: 0,
      backgroundColor: 'rgba(128, 0, 128, 0.2)'
    },
    visible: {
      width: '20px',
      backgroundColor: 'rgba(128, 0, 128, 0.8)'
    }
  };

  return (
    <div className="flex justify-center items-center h-full text-purple-300">
      <div className="relative flex items-center space-x-2">
        <span>{text}</span>
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate={index <= lineCount ? "visible" : "hidden"}
              variants={lineVariants}
              transition={{
                duration: 0.3,
                ease: "easeInOut"
              }}
              className="h-1 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
});

// Alternative star-based version
export const StarLoadingDots = memo(({ text }: LoadingDotsProps) => {
  const [starCount, setStarCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStarCount((prevStarCount) => (prevStarCount + 1) % 4);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center h-full text-purple-300">
      <div className="relative flex items-center space-x-2">
        <span>{text}</span>
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                scale: 0.5,
                color: 'rgba(128, 0, 128, 0.3)'
              }}
              animate={{
                opacity: index <= starCount ? 1 : 0,
                scale: index <= starCount ? 1 : 0.5,
                color: 'rgba(255, 215, 0, 1)' // Gold color for stars
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut"
              }}
              className="text-xl"
            >
              ✦
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
});