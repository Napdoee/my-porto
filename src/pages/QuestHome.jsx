import {
  BriefcaseBusiness,
  FolderKanban,
  MessageSquare,
  TerminalSquare,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import OSWindow from "../components/OSWindow";
import QuestCard from "../components/QuestCard";
import PixelButton from "../components/PixelButton";

const QuestHome = () => {
  const { settings, projects, experiences } = useOutletContext();
  const featuredCount = projects.filter((project) => project.isFeatured).length;

  return (
    <div className="page-screen quest-home-screen">
      <div className="container">
        <div className="quest-hero-grid">
          <OSWindow
            title="QUEST OS HUB"
            subtitle="C:\\NAPDOEE\\DESKTOP"
            style={{ minHeight: "100%" }}
          >
            <div className="quest-home-intro">
              <span className="font-retro-label quest-eyebrow">
                SYSTEM READY
              </span>
              <h1>NAPDOEE</h1>
              <p>
                {settings.tagline ||
                  "Interactive developer portfolio dengan retro OS, RPG quest, dan project explorer."}
              </p>
              <div className="quest-home-actions">
                <PixelButton
                  variant="orange"
                  onClick={() => {
                    window.location.href = "/projects";
                  }}
                  ariaLabel="Open project explorer"
                >
                  OPEN PROJECTS
                </PixelButton>
                <PixelButton
                  variant="primary"
                  onClick={() => {
                    window.location.href = "/contact";
                  }}
                  ariaLabel="Open mission request"
                >
                  SEND MISSION
                </PixelButton>
              </div>
            </div>
          </OSWindow>

          <OSWindow title="STATUS PANEL" subtitle="PLAYER.LOG">
            <div className="status-grid">
              <div>
                <span>{projects.length}</span>
                <p>PROJECT FILES</p>
              </div>
              <div>
                <span>{featuredCount}</span>
                <p>TOP BUILDS</p>
              </div>
              <div>
                <span>{experiences.length}</span>
                <p>ARCHIVE LOGS</p>
              </div>
              <div>
                <span>{settings.location || "MAKASSAR"}</span>
                <p>LOCATION</p>
              </div>
            </div>
          </OSWindow>
        </div>

        <div className="quest-card-grid">
          <QuestCard
            to="/profile"
            icon={BriefcaseBusiness}
            code="QUEST_01"
            title="Character Sheet"
            description="Buka profil, stats, skill XP, dan working style."
          />
          <QuestCard
            to="/projects"
            icon={FolderKanban}
            code="QUEST_02"
            title="Project Explorer"
            description="Browse folder project, filter build, dan buka case file."
          />
          <QuestCard
            to="/experience"
            icon={TerminalSquare}
            code="QUEST_03"
            title="Archive Terminal"
            description="Lihat perjalanan kerja, organisasi, training, dan sertifikasi."
          />
          <QuestCard
            to="/contact"
            icon={MessageSquare}
            code="QUEST_04"
            title="Mission Request"
            description="Kirim inquiry, brief project, atau ajakan kolaborasi."
          />
        </div>
      </div>
    </div>
  );
};

export default QuestHome;
