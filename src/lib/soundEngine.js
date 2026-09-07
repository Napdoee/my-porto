let audioContext = null;
let musicTimer = null;
let musicStep = 0;
let enabled = localStorage.getItem('quest-os-sound') === 'true';

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  return audioContext;
}

function playTone({ frequency, duration = 0.08, type = 'square', volume = 0.035, delay = 0 }) {
  if (!enabled) return;

  try {
    const context = getAudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const startAt = context.currentTime + delay;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.02);
  } catch (err) {
    console.warn('Quest OS audio failed:', err);
  }
}

export function isSoundEnabled() {
  return enabled;
}

export function setSoundEnabled(value) {
  enabled = Boolean(value);
  localStorage.setItem('quest-os-sound', String(enabled));

  if (enabled) {
    getAudioContext();
    playSelect();
    startMusic();
  } else {
    stopMusic();
  }
}

export function playClick() {
  playTone({ frequency: 330, duration: 0.055, volume: 0.03 });
}

export function playSelect() {
  playTone({ frequency: 440, duration: 0.05, volume: 0.026 });
  playTone({ frequency: 660, duration: 0.06, volume: 0.024, delay: 0.055 });
}

export function playBoot() {
  [220, 330, 440, 660].forEach((frequency, index) => {
    playTone({ frequency, duration: 0.09, volume: 0.034, delay: index * 0.09 });
  });
}

export function playError() {
  playTone({ frequency: 120, duration: 0.12, type: 'sawtooth', volume: 0.035 });
}

export function playSuccess() {
  [392, 523, 659].forEach((frequency, index) => {
    playTone({ frequency, duration: 0.08, volume: 0.032, delay: index * 0.075 });
  });
}

export function startMusic() {
  if (!enabled || musicTimer) return;

  const notes = [196, 0, 247, 0, 262, 0, 247, 0, 196, 0, 165, 0, 196, 0, 0, 0];
  musicTimer = window.setInterval(() => {
    const frequency = notes[musicStep % notes.length];
    if (frequency) {
      playTone({ frequency, duration: 0.12, type: 'triangle', volume: 0.012 });
    }
    musicStep += 1;
  }, 280);
}

export function stopMusic() {
  if (musicTimer) {
    window.clearInterval(musicTimer);
    musicTimer = null;
  }
}
