import { useState } from "react";
import { Outlet } from "react-router-dom";
import GameHUD from "../components/GameHUD";
import SplashPage from "../components/SplashPage";
import { usePortfolioData } from "../lib/portfolioData";

const GameLayout = () => {
  const [showSplash, setShowSplash] = useState(
    () => sessionStorage.getItem("quest-os-booted") !== "true",
  );
  const data = usePortfolioData();
  const brandName = "NAPDOEE";

  const completeBoot = () => {
    sessionStorage.setItem("quest-os-booted", "true");
    setShowSplash(false);
  };

  return (
    <div className="game-shell">
      {showSplash && (
        <SplashPage brandName={brandName} onComplete={completeBoot} />
      )}
      <GameHUD brandName={brandName} />
      <main className="game-main">
        <Outlet context={data} />
      </main>
      <footer className="game-footer">
        <div className="container">
          <h3 className="font-retro-game">GAME OVER. THANKS FOR PLAYING!</h3>
          <div className="game-footer-links">
            <a
              href={data.settings.github || "https://github.com"}
              target="_blank"
              rel="noreferrer"
            >
              [ GITHUB ]
            </a>
            <a
              href={data.settings.linkedin || "https://linkedin.com"}
              target="_blank"
              rel="noreferrer"
            >
              [ LINKEDIN ]
            </a>
            <a
              href={data.settings.instagram || "https://instagram.com"}
              target="_blank"
              rel="noreferrer"
            >
              [ INSTAGRAM ]
            </a>
          </div>
          <p className="font-retro-label">
            (C) 2026 {brandName.toUpperCase()} QUEST OS. CREATED WITH React +
            Vite.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default GameLayout;
