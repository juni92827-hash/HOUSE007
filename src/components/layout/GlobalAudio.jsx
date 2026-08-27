import { useEffect, useRef } from 'react';
import { useAudioStore } from '../../stores/audioStore';
import { AUDIO_TRACK_PATH } from '../../utils/assetPaths';

/**
 * GlobalAudio — mounts ONE ambient <audio> element for the entire site and
 * drives it from audioStore. The `src` never changes with navigation, so
 * playback is never interrupted or restarted when moving between pages
 * (Landing -> Home -> Collection -> AI Style -> Product Detail -> Bag ->
 * Checkout). No mp3 ships yet, so playback simply no-ops until a real file
 * is placed at AUDIO_TRACK_PATH; the on/off + volume state is fully
 * functional regardless.
 */
function GlobalAudio() {
  const enabled = useAudioStore((state) => state.enabled);
  const volume = useAudioStore((state) => state.volume);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    if (enabled) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [enabled, volume]);

  return <audio ref={audioRef} src={AUDIO_TRACK_PATH} loop />;
}

export default GlobalAudio;
