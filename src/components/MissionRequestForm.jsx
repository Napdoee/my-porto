import { useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import PixelButton from './PixelButton';
import PixelCard from './PixelCard';
import { playError, playSuccess } from '../lib/soundEngine';

const getInitialForm = (selectedProject, devName) => ({
  name: '',
  whatsapp: '',
  email: '',
  detail: selectedProject ? `Halo ${devName || 'Napdoee'}, saya tertarik mendiskusikan project [${selectedProject}] dan kebutuhan serupa. Berikut konteks yang ingin saya bahas: ` : '',
});

const MissionRequestForm = ({ settings = {}, selectedProject = '' }) => {
  const [formData, setFormData] = useState(() => getInitialForm(selectedProject, settings.dev_name));
  const [formErrors, setFormErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'NAMA HARUS DIISI';

    const waPattern = /^(?:\+62|62|0)8[1-9][0-9]{7,10}$/;
    if (!formData.whatsapp.trim()) {
      errors.whatsapp = 'NOMOR WHATSAPP HARUS DIISI';
    } else if (!waPattern.test(formData.whatsapp.trim().replace(/\s+/g, ''))) {
      errors.whatsapp = 'FORMAT WHATSAPP INDONESIA TIDAK VALID (CONTOH: 08123456789)';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'EMAIL HARUS DIISI';
    } else if (!emailPattern.test(formData.email.trim())) {
      errors.email = 'FORMAT EMAIL TIDAK VALID';
    }

    if (!formData.detail.trim()) errors.detail = 'DETAIL PROJECT HARUS DIISI';

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) playError();
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: formData.name,
          whatsapp: formData.whatsapp,
          email: formData.email,
          detail: formData.detail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal mengirim inquiry');
      }

      setSubmitSuccess(true);
      playSuccess();
      const whatsappTarget = settings.whatsapp || '6288237106135';
      const waText = encodeURIComponent(`GG! MISSION REQUEST SUBMITTED!\n\nNama: ${formData.name}\nEmail: ${formData.email}\nWhatsApp: ${formData.whatsapp}\nDetail Project: ${formData.detail}`);
      setTimeout(() => window.open(`https://wa.me/${whatsappTarget}?text=${waText}`, '_blank'), 1000);
    } catch (err) {
      alert(`GAME OVER. Submit failed: ${err.message}`);
    }
  };

  if (submitSuccess) {
    return (
      <PixelCard stageLabel="MISSION LOG">
        <div className="mission-success animate-jump">
          <div className="mission-success-icon"><Check size={36} /></div>
          <h3 className="font-retro-game">VICTORY!</h3>
          <p className="font-retro-label">Inquiry berhasil di-submit ke database. Membuka deep-link konfirmasi WhatsApp...</p>
          <PixelButton variant="gray" onClick={() => { setSubmitSuccess(false); setFormData(getInitialForm('', settings.dev_name)); }}>KIRIM PESAN BARU</PixelButton>
        </div>
      </PixelCard>
    );
  }

  return (
    <PixelCard stageLabel="MISSION REQUEST">
      <form onSubmit={handleSubmit} className="mission-form">
        {selectedProject && <div className="selected-project-pill">PROJECT DIPILIH: {selectedProject.toUpperCase()}</div>}
        <div>
          <label className="pixel-label" htmlFor="name">NAMA LENGKAP</label>
          <input id="name" type="text" placeholder="Masukan nama lengkap Anda" className={`pixel-input ${formErrors.name ? 'pixel-input-error' : ''}`} value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} />
          {formErrors.name && <div className="error-text"><AlertCircle size={12} /> {formErrors.name}</div>}
        </div>
        <div>
          <label className="pixel-label" htmlFor="whatsapp">NOMOR WHATSAPP</label>
          <input id="whatsapp" type="tel" placeholder="Contoh: 08123456789" className={`pixel-input ${formErrors.whatsapp ? 'pixel-input-error' : ''}`} value={formData.whatsapp} onChange={(event) => setFormData({ ...formData, whatsapp: event.target.value })} />
          {formErrors.whatsapp && <div className="error-text"><AlertCircle size={12} /> {formErrors.whatsapp}</div>}
        </div>
        <div>
          <label className="pixel-label" htmlFor="email">EMAIL VALID</label>
          <input id="email" type="email" placeholder="nama@email.com" className={`pixel-input ${formErrors.email ? 'pixel-input-error' : ''}`} value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} />
          {formErrors.email && <div className="error-text"><AlertCircle size={12} /> {formErrors.email}</div>}
        </div>
        <div>
          <label className="pixel-label" htmlFor="detail">DETAIL TUJUAN / INQUIRY PROJECT</label>
          <textarea id="detail" rows="6" placeholder="Jelaskan kebutuhan website, kerja sama, atau project yang ingin Anda diskusikan" className={`pixel-input ${formErrors.detail ? 'pixel-input-error' : ''}`} value={formData.detail} onChange={(event) => setFormData({ ...formData, detail: event.target.value })} />
          {formErrors.detail && <div className="error-text"><AlertCircle size={12} /> {formErrors.detail}</div>}
        </div>
        <PixelButton variant="orange" type="submit" ariaLabel="Submit mission request">SUBMIT MISSION</PixelButton>
      </form>
    </PixelCard>
  );
};

export default MissionRequestForm;
