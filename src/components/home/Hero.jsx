import { useState } from 'react';
import { useClientFileStore } from '../../stores/clientFileStore';
import { HERO_IMAGE_PATH, HERO_VIDEO_PATH } from '../../utils/assetPaths';
import './hero.css';

/**
 * Hero — HOME hero section. Cascades HERO_VIDEO_PATH -> HERO_IMAGE_PATH ->
 * text placeholder, so dropping in either asset later needs no code change.
 */
function Hero() {
  const openClientFile = useClientFileStore((s) => s.openClientFile);
  const [videoFailed, setVideoFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const scrollToCollection = () => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="h007-hero">
      {!videoFailed ? (
        <video
          className="h007-hero__media"
          src={HERO_VIDEO_PATH}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoFailed(true)}
        />
      ) : !imageFailed ? (
        <img
          className="h007-hero__media"
          src={HERO_IMAGE_PATH}
          alt="HOUSE 007 bespoke tailoring"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="h007-hero__video-placeholder" aria-hidden="true">
          <span className="h007-hero__video-label">HERO VIDEO PLACEHOLDER</span>
        </div>
      )}
      <div className="h007-hero__content">
        <h1 className="h007-hero__title">THE PERFECT FIT</h1>
        <p className="h007-hero__subcopy">
          Designed by intelligence.
          <br />
          Perfected by the Master.
        </p>
        <div className="h007-hero__actions">
          <button type="button" className="h007-button-text h007-hero__button" onClick={scrollToCollection}>
            SHOP THE COLLECTION
          </button>
          <button
            type="button"
            className="h007-button-text h007-hero__button h007-hero__button--ghost"
            onClick={openClientFile}
          >
            START YOUR PROFILE
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
