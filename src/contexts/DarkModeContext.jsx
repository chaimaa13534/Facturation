import { createContext, useContext, useState, useEffect } from "react";

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
   
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      return JSON.parse(saved);
    }
    
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {

    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode doit être utilisé dans DarkModeProvider");
  }
  return context;
};
