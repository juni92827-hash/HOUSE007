import ProductPlaceholder from '../common/ProductPlaceholder.jsx';
import './master-section.css';

const CRAFT_VIEWS = ['FABRIC SELECTION', 'LAPEL ADJUSTMENT', 'THE FITTING'];

/**
 * MasterSection — "THE MASTER" home section (not a separate page).
 */
function MasterSection() {
  return (
    <section className="h007-master">
      <div className="h007-content h007-master__inner">
        <div className="h007-master__copy">
          <h2 className="h007-section-title">THE MASTER</h2>
          <p className="h007-section-subcopy">
            INTELLIGENCE FINDS YOUR STYLE.
            <br />
            THE MASTER PERFECTS IT.
          </p>
        </div>
        <div className="h007-master__gallery">
          {CRAFT_VIEWS.map((view) => (
            <div className="h007-master__frame" key={view}>
              <ProductPlaceholder name="THE MASTER" view={view} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MasterSection;
