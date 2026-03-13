import React, { useEffect, useState } from 'react';

const DarkModeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={theme === "light" ? "Enable dark mode" : "Enable light mode"}
      title={theme === "light" ? "Dark mode" : "Light mode"}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
};

export default DarkModeToggle;
