import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { playClick, playSelect } from '../lib/soundEngine';

const QuestCard = ({ to, icon: Icon, code, title, description, cta = 'OPEN QUEST' }) => (
  <Link to={to} className="quest-card cursor-pointer" onClick={playClick} onMouseEnter={playSelect}>
    <div className="quest-card-icon">{Icon && <Icon size={24} />}</div>
    <div className="font-retro-label quest-card-code">{code}</div>
    <h3 className="font-retro-game quest-card-title">{title}</h3>
    <p className="font-retro-label quest-card-description">{description}</p>
    <span className="font-retro-label quest-card-cta">
      {cta} <ArrowUpRight size={14} />
    </span>
  </Link>
);

export default QuestCard;
