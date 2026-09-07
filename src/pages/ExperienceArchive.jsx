import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import OSWindow from "../components/OSWindow";
import { getCategoryLabel, getCategorySlug } from "../lib/portfolioData";

const ExperienceArchive = () => {
  const { experiences } = useOutletContext();
  const categories = useMemo(() => {
    const map = new Map();
    experiences.forEach((experience) => {
      const category = experience.category || { label: "OTHER", slug: "other" };
      const slug = getCategorySlug(category);
      if (!map.has(slug)) map.set(slug, { category, items: [] });
      map.get(slug).items.push(experience);
    });
    return Array.from(map.values());
  }, [experiences]);
  const [activeSlug, setActiveSlug] = useState("all");
  const visibleExperiences =
    activeSlug === "all"
      ? experiences
      : experiences.filter(
          (item) => getCategorySlug(item.category) === activeSlug,
        );

  return (
    <div className="page-screen">
      <div className="container">
        <OSWindow title="ARCHIVE TERMINAL" subtitle="C:\\PORTFOLIO\\EXPERIENCE">
          <div className="terminal-filter-row">
            <button
              className={activeSlug === "all" ? "active" : ""}
              onClick={() => setActiveSlug("all")}
              type="button"
            >
              ALL
            </button>
            {categories.map(({ category }) => {
              const slug = getCategorySlug(category);
              return (
                <button
                  key={slug}
                  className={activeSlug === slug ? "active" : ""}
                  onClick={() => setActiveSlug(slug)}
                  type="button"
                >
                  {getCategoryLabel(category)}
                </button>
              );
            })}
          </div>

          <div className="archive-grid">
            {visibleExperiences.map((experience, index) => (
              <article
                key={experience.id || `${experience.title}-${index}`}
                className="archive-card"
              >
                <div className="font-retro-label archive-command">
                  C:\portfolio\experience&gt; open{" "}
                  {getCategorySlug(experience.category)}
                </div>
                <h3 className="font-retro-game">{experience.title}</h3>
                <p className="font-retro-label archive-meta">
                  {experience.organization} / {experience.period}
                </p>
                <p className="font-retro-label archive-body">
                  {experience.description}
                </p>
                <div className="tag-row">
                  {(experience.skills || []).map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </OSWindow>
      </div>
    </div>
  );
};

export default ExperienceArchive;
