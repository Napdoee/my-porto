import { useOutletContext, useSearchParams } from 'react-router-dom';
import OSWindow from '../components/OSWindow';
import MissionRequestForm from '../components/MissionRequestForm';

const Contact = () => {
  const { settings } = useOutletContext();
  const [searchParams] = useSearchParams();
  const selectedProject = searchParams.get('project') || '';

  return (
    <div className="page-screen">
      <div className="container contact-container">
        <OSWindow title="MISSION REQUEST" subtitle="C:\\PORTFOLIO\\CONTACT">
          <div className="contact-intro">
            <span className="font-retro-label">QUEST BOARD OPEN</span>
            <h1 className="font-retro-game">Submit Brief</h1>
            <p className="font-retro-label">Kirim kebutuhan website, kerja sama, atau ide project. Data masuk ke inquiry database dan dilanjutkan lewat WhatsApp.</p>
          </div>
          <MissionRequestForm settings={settings} selectedProject={selectedProject} />
        </OSWindow>
      </div>
    </div>
  );
};

export default Contact;
