import { useAudioStore } from '../../stores/audioStore';
import './audio-controls.css';

/**
 * AudioControls — the global audio controller required across every page.
 * Text-based on/off toggle plus a volume slider; no icons.
 */
function AudioControls() {
  const enabled = useAudioStore((s) => s.enabled);
  const volume = useAudioStore((s) => s.volume);
  const toggleEnabled = useAudioStore((s) => s.toggleEnabled);
  const setVolume = useAudioStore((s) => s.setVolume);

  return (
    <div className="h007-audio-controls">
      <button type="button" className="h007-nav-text h007-audio-controls__toggle" onClick={toggleEnabled}>
        {enabled ? 'SOUND ON' : 'SOUND OFF'}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        className="h007-audio-controls__volume"
        aria-label="Volume"
      />
    </div>
  );
}

export default AudioControls;
