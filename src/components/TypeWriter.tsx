import { useState, useEffect } from "react";

interface TypeWriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  showCursor?: boolean;
  loop?: boolean;
}

export const TypeWriter = ({
  text,
  speed = 100,
  delay = 0,
  className = "",
  showCursor = true,
  loop = false,
}: TypeWriterProps) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursorState, setShowCursorState] = useState(true);

  // Cursor blinking effect
  useEffect(() => {
    if (!showCursor) return;

    const cursorInterval = setInterval(() => {
      setShowCursorState((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [showCursor]);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;

    if (!isDeleting && currentIndex < text.length) {
      // Typing forward
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (!isDeleting && currentIndex === text.length && loop) {
      // Finished typing, wait before deleting
      const timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);

      return () => clearTimeout(timer);
    } else if (isDeleting && currentIndex > 0) {
      // Deleting
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
        setCurrentIndex((prev) => prev - 1);
      }, speed / 2);

      return () => clearTimeout(timer);
    } else if (isDeleting && currentIndex === 0) {
      // Finished deleting, start typing again
      setIsDeleting(false);
    }
  }, [currentIndex, text, speed, isTyping, isDeleting, loop]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <span
          className={`inline-block ml-1 ${
            showCursorState ? "opacity-100" : "opacity-0"
          } transition-opacity duration-100`}
        >
          |
        </span>
      )}
    </span>
  );
};
