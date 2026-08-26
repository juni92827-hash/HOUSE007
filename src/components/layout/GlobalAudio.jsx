import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAudioStore } from '../../stores/audioStore';

/**
 * GlobalAudio — mounts the two ambient tracks (landing / home) and drives
 * them from audioStore. No mp3 files ship yet (see project notes), so the
 * <audio> elements sit with an empty src until final music is supplied;
 * playback simply no-ops until then, but the on/off + volume state and
 * cross-page persistence are fully functional.
 */
function GlobalAudio() {
  const location = useLocation();
  const enabled = useAudioStore((state) => state.enabled);
  const volume = useAudioStore((state) => state.volume);
  const track = useAudioStore((state) => state.track);
  const setTrack = useAudioStore((state) => state.setTrack);
  const audioRef = useRef(null);

  useEffect(() => {
    setTrack(location.pathname === '/' ? 'landing' : 'home');
  }, [location.pathname, setTrack]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    if (enabled) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [enabled, volume, track]);

  const src = track === 'landing' ? '/audio/landing.mp3' : '/audio/home.mp3';

  return <audio ref={audioRef} src={src} loop />;
}

export default GlobalAudio;
