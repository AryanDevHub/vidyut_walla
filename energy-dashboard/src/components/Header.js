import React, { useEffect, useState } from "react";
import { CONFIG } from "../services/config";
import { useAuth } from "../contexts/AuthContext";
import HamburgerButton from "./common/HamburgerButton";

const Header = ({ onMenuClick, isSidebarOpen }) => {
  const [currentTime, setCurrentTime] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formattedTime = now.toLocaleString(CONFIG.LOCALE, {
        timeZone: CONFIG.TIMEZONE,
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      setCurrentTime(formattedTime);
    };

    updateClock();
    const intervalId = setInterval(updateClock, CONFIG.TIME_UPDATE_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const themeSwitcher = document.getElementById("theme-switcher");
    const applyTheme = (theme) => {
      document.documentElement.setAttribute("data-color-scheme", theme);
    };

    const handleThemeToggle = () => {
      const currentScheme = document.documentElement.getAttribute("data-color-scheme");
      const newScheme = currentScheme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newScheme);
      applyTheme(newScheme);
    };

    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);

    themeSwitcher.addEventListener("click", handleThemeToggle);
    return () => themeSwitcher.removeEventListener("click", handleThemeToggle);
  }, []);

  return (
    <header className="header" role="banner">
      <div className="container">
        <div className="header-content">
          {/* Left Section */}
          <div className="header-left">
            <HamburgerButton onClick={onMenuClick} isOpen={isSidebarOpen} />
            <div className="header-greeting">
              <h2>Welcome back, {user?.name || "Admin"}!</h2>
              <p>Here is your campus energy overview for today.</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="header-right">
            <div className="header-status-time">
              <span className="status status--success">System Operational</span>
              <time className="current-time">{currentTime}</time>
            </div>
            <div className="header-theme-toggle">
              <button
                id="theme-switcher"
                className="btn btn--icon"
                title="Toggle theme"
                aria-label="Toggle light/dark mode"
              >
                💡
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
