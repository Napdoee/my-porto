import { useOutletContext } from 'react-router-dom';
import StatSheet from '../components/StatSheet';

const Profile = () => {
  const { settings } = useOutletContext();

  return (
    <div className="page-screen compact-page">
      <StatSheet settings={settings} />
    </div>
  );
};

export default Profile;
