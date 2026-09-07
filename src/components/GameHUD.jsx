import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Gamepad2, Volume2, VolumeX, ShieldAlert } from "lucide-react";
import {
  isSoundEnabled,
  playClick,
  playSelect,
  setSoundEnabled as setGlobalSoundEnabled,
  startMusic,
  stopMusic,
} from "../lib/soundEngine";

const GameHUD = ({ activeStage, scrollToSection, brandName }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(() => isSoundEnabled());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const percentage = (window.scrollY / totalScroll) * 100;
        setScrollProgress(percentage);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (soundEnabled) startMusic();
    return () => stopMusic();
  }, [soundEnabled]);

  const stages = [
    { id: "hero", label: "HUB", num: "00", to: "/" },
    { id: "about", label: "CHARACTER", num: "01", to: "/profile" },
    { id: "projects", label: "PROJECTS", num: "02", to: "/projects" },
    { id: "experiences", label: "ARCHIVE", num: "03", to: "/experience" },
    { id: "contact", label: "CONTACT", num: "04", to: "/contact" },
  ];

  const handleNavClick = (id) => {
    if (scrollToSection) scrollToSection(id);
    setMobileMenuOpen(false);
    playClick();
  };

  const handleSoundToggle = () => {
    const nextEnabled = !soundEnabled;
    setSoundEnabled(nextEnabled);
    setGlobalSoundEnabled(nextEnabled);
  };

  return (
    <header
      style={{
        position: "fixed",
        top: "16px",
        left: "16px",
        right: "16px",
        zIndex: 1000,
      }}
    >
      <div
        className="pixel-box"
        style={{
          backgroundColor: "var(--bg-primary)",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        {/* Brand logo */}
        <Link
          to="/"
          className="font-retro-game cursor-pointer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px",
            color: "var(--color-text)",
            textDecoration: "none",
          }}
          onClick={() => handleNavClick("hero")}
        >
          <Gamepad2 size={24} style={{ color: "var(--color-highlight)" }} />
          <span>{brandName || "NAPDOEE"}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
          className="desktop-only"
        >
          {stages.map((stage) => {
            const isActive = activeStage
              ? activeStage === stage.id
              : stage.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(stage.to);
            return (
              <Link
                key={stage.id}
                to={stage.to}
                onClick={() => handleNavClick(stage.id)}
                className="font-retro-label cursor-pointer"
                style={{
                  background: "none",
                  border: "none",
                  padding: "4px 8px",
                  fontSize: "11px",
                  color: isActive
                    ? "var(--color-highlight)"
                    : "var(--color-text)",
                  borderBottom: isActive
                    ? "3px solid var(--color-highlight)"
                    : "3px solid transparent",
                  fontWeight: isActive ? "bold" : "normal",
                  transform: isActive ? "translateY(1px)" : "none",
                  textDecoration: "none",
                }}
              >
                {stage.num} {stage.label}
              </Link>
            );
          })}
        </nav>

        {/* HUD Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Sound Toggle (Muted by default to respect accessibility and battery) */}
          <button
            onClick={handleSoundToggle}
            className="cursor-pointer pixel-box"
            style={{
              padding: "6px",
              backgroundColor: soundEnabled ? "var(--color-accent)" : "#FFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "38px",
              height: "38px",
              border: "2px solid var(--color-border)",
              boxShadow: "2px 2px 0px 0px var(--color-border)",
            }}
            title={soundEnabled ? "Mute audio" : "Enable 8-bit sound fx"}
            aria-label="Toggle 8-bit sound"
          >
            {soundEnabled ? (
              <Volume2 size={18} color="#FFF" />
            ) : (
              <VolumeX size={18} />
            )}
          </button>

          {/* Admin gate */}
          <a
            href="/admin/login"
            onClick={playSelect}
            className="cursor-pointer pixel-box"
            style={{
              padding: "6px",
              backgroundColor: "#FFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "38px",
              height: "38px",
              border: "2px solid var(--color-border)",
              boxShadow: "2px 2px 0px 0px var(--color-border)",
              color: "var(--color-text)",
            }}
            title="Admin Login"
            aria-label="Admin Page"
          >
            <ShieldAlert size={18} />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="cursor-pointer pixel-box mobile-only"
            style={{
              padding: "6px",
              backgroundColor: "#FFF",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              width: "38px",
              height: "38px",
              border: "2px solid var(--color-border)",
              boxShadow: "2px 2px 0px 0px var(--color-border)",
            }}
            aria-label="Toggle Navigation Menu"
          >
            <div
              style={{
                width: "22px",
                height: "3px",
                backgroundColor: "var(--color-text)",
              }}
            ></div>
            <div
              style={{
                width: "22px",
                height: "3px",
                backgroundColor: "var(--color-text)",
              }}
            ></div>
            <div
              style={{
                width: "22px",
                height: "3px",
                backgroundColor: "var(--color-text)",
              }}
            ></div>
          </button>
        </div>
      </div>

      {/* Retro HUD Scrolling HP/XP Progress Bar */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "4px auto 0 auto",
          height: "10px",
          backgroundColor: "#DDD",
          border: "2px solid var(--color-border)",
          position: "relative",
          overflow: "hidden",
        }}
        title="Scroll Completion XP Bar"
      >
        <div
          style={{
            height: "100%",
            width: `${scrollProgress}%`,
            backgroundColor: "var(--color-accent)",
            backgroundImage:
              "linear-gradient(90deg, var(--color-accent) 0%, #76FF7A 100%)",
            transition: "width 100ms ease-out",
          }}
        />
        <span
          className="font-retro-label"
          style={{
            position: "absolute",
            right: "4px",
            top: "-2px",
            fontSize: "8px",
            color: "var(--color-text)",
            pointerEvents: "none",
          }}
        >
          XP {Math.round(scrollProgress)}%
        </span>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="animate-jump pixel-box mobile-only"
          style={{
            backgroundColor: "var(--bg-primary)",
            marginTop: "8px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            borderWidth: "3px",
          }}
        >
          {stages.map((stage) => {
            const isActive = activeStage
              ? activeStage === stage.id
              : stage.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(stage.to);
            return (
              <Link
                key={stage.id}
                to={stage.to}
                onClick={() => handleNavClick(stage.id)}
                className="font-retro-label cursor-pointer"
                style={{
                  background: isActive ? "var(--color-highlight)" : "none",
                  border: "2px solid var(--color-border)",
                  color: isActive ? "#FFF" : "var(--color-text)",
                  padding: "12px",
                  fontSize: "13px",
                  width: "100%",
                  textAlign: "left",
                  boxShadow: isActive
                    ? "none"
                    : "2px 2px 0px var(--color-border)",
                  textDecoration: "none",
                  display: "block",
                }}
              >
                {stage.num} {stage.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Inject responsive CSS directly into DOM context safely */}
      <style>{`
        .desktop-only {
          display: flex;
        }
        .mobile-only {
          display: none;
        }
        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-only {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};

export default GameHUD;
