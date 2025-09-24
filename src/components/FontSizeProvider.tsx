import { createContext, useContext, useState, useEffect } from 'react';

interface FontSizeContextType {
  isLargeFont: boolean;
  toggleLargeFont: () => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export const FontSizeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLargeFont, setIsLargeFont] = useState(false);

  useEffect(() => {
    if (isLargeFont) {
      document.documentElement.classList.add('large-font');
    } else {
      document.documentElement.classList.remove('large-font');
    }
  }, [isLargeFont]);

  const toggleLargeFont = () => {
    setIsLargeFont(prev => !prev);
  };

  return (
    <FontSizeContext.Provider value={{ isLargeFont, toggleLargeFont }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};
