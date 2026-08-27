import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../image/logo/1.png';
import { useAudioStore } from '../stores/audioStore';
import { HERO_IMAGE_PATH } from '../utils/assetPaths';
import './landing-page.css';

const RING_COUNT = 4;

/**
 * LandingPage — the cinematic entry to HOUSE 007. A set of concentric rings
 * converge toward the center over ~2.6s (gun-barrel-inspired movement),
 * then the HOUSE 007 mark is revealed with an ENTER prompt that transitions
 * into the Main Website at /home.
 */
function LandingPage() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [portraitFailed, setPortraitFailed] = useState(false);
  const navigate = useNavigate();
  const setEnabled = useAudioStore((s) => s.setEnabled);

  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 2600);
    return () => clearTimeout(timer);
  }, []);

  const enterHouse = () => {
    setEnabled(true);
    navigate('/home');
  };

  return (
    <div className="h007-landing" onClick={() => !isRevealed && setIsRevealed(true)}>
      {!portraitFailed && (
        <img
          src={HERO_IMAGE_PATH}
          alt=""
          aria-hidden="true"
          className={`h007-landing__portrait ${isRevealed ? 'h007-landing__portrait--visible' : ''}`}
          onError={() => setPortraitFailed(true)}
        />
      )}
      <div className="h007-landing__rings" aria-hidden="true">
        {Array.from({ length: RING_COUNT }).map((_, i) => (
          <span
            key={i}
            className="h007-landing__ring"
            style={{
              width: `${900 - i * 200}px`,
              height: `${900 - i * 200}px`,
              animationDelay: `${i * 150}ms`,
            }}
          />
        ))}
      </div>

      <div className={`h007-landing__reveal ${isRevealed ? 'h007-landing__reveal--visible' : ''}`}>
        <img src={logo} alt="HOUSE 007" className="h007-landing__logo" />
        <p className="h007-landing__tagline">A SECRET TAILORING HOUSE</p>
        <button type="button" className="h007-button-text h007-landing__enter" onClick={enterHouse}>
          ENTER THE HOUSE
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
