"use client";

import * as React from "react";
import { motion } from "framer-motion";

export const BlurredStagger = ({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const words = text.split(" ");
  let charCounter = 0;

  return (
    <motion.p
      initial="hidden"
      animate="show"
      className={className}
      style={{
        textAlign: "left",
        wordBreak: "keep-all",
        ...style,
      }}
    >
      {words.map((word, wordIndex) => {
        return (
          <span
            key={wordIndex}
            className="inline-block whitespace-nowrap"
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
          >
            {word.split("").map((char, charIndex) => {
              const globalIndex = charCounter++;
              return (
                <motion.span
                  key={charIndex}
                  initial={{ opacity: 0, filter: "blur(8px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.25,
                    delay: globalIndex * 0.008,
                    ease: "easeOut",
                  }}
                  className="inline-block"
                  style={{ display: "inline-block" }}
                >
                  {char}
                </motion.span>
              );
            })}
            {/* Add a space after the word, preserving layout */}
            {wordIndex < words.length - 1 && (
              <span className="inline-block" style={{ display: "inline-block" }}>
                &nbsp;
              </span>
            )}
          </span>
        );
      })}
    </motion.p>
  );
};
