import React, { useEffect, useState, useRef } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  className?: string;
  characters?: string;
  triggerKey?: string | number | boolean;
}

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 25,
  maxIterations = 10,
  className = '',
  characters = '0123456789ABCDEF$#@%&*!~§±Ωµ',
  triggerKey,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const iterationRef = useRef(0);

  useEffect(() => {
    let interval: number;
    iterationRef.current = 0;

    interval = window.setInterval(() => {
      setDisplayText(() =>
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iterationRef.current / (maxIterations / text.length)) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      iterationRef.current += 1;
      if (iterationRef.current > maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, triggerKey, speed, maxIterations, characters]);

  return <span className={`font-mono ${className}`}>{displayText}</span>;
};
