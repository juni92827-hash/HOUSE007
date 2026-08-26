import { useClientFileStore } from '../../stores/clientFileStore';
import './hero.css';

/**
 * Hero — HOME hero section. The real cinematic tailor-atelier video is not
 * shot yet, so a placeholder fills the exact video frame (full width,
 * object-fit cover) so a final MP4 can be dropped in without layout change.
 */
function Hero() {
  const openClientFile = useClientFileStore((s) => s.openClientFile);

  const scrollToCollection = () => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="h007-hero">
      <div className="h007-hero__video-placeholder" aria-hidden="true">
        <span className="h007-hero__video-label">HERO VIDEO PLACEHOLDER</span>
      </div>
      <div className="h007-hero__content">
        <h1 className="h007-hero__title">THE PERFECT FIT</h1>
        <p className="h007-hero__subcopy">
          Designed by intelligence.
          <br />
          Perfected by the Master.
        </p>
        <div className="h007-hero__actions">
          <button type="button" className="h007-nav-text h007-hero__button" onClick={scrollToCollection}>
            SHOP THE COLLECTION
          </button>
          <button
            type="button"
            className="h007-nav-text h007-hero__button h007-hero__button--ghost"
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
