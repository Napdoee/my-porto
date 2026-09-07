const OSWindow = ({ title, subtitle, children, style = {}, bodyStyle = {} }) => (
  <section className="os-window" style={style}>
    <div className="os-window-titlebar">
      <div>
        <div className="font-retro-label os-window-subtitle">{subtitle || 'QUEST_OS.EXE'}</div>
        <h2 className="font-retro-game os-window-title">{title}</h2>
      </div>
      <div className="os-window-controls" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
    <div className="os-window-body" style={bodyStyle}>{children}</div>
  </section>
);

export default OSWindow;
