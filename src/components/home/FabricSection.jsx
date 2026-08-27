import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FABRIC_CATEGORIES } from '../../data/fabricData';
import { useProductsStore } from '../../stores/productsStore';
import ProductPlaceholder from '../common/ProductPlaceholder.jsx';
import './fabric-section.css';

/**
 * FabricSection — "THE FABRIC" interactive swatches. Material / Pattern /
 * Color selections filter the live product catalog so the connection is
 * real, not decorative (Finish is informational-only, matching the schema).
 * Clicking a MATERIAL swatch also sets it as the active large texture
 * preview (image + MATERIAL/PATTERN/COLOR/FINISH info).
 */
function FabricSection() {
  const products = useProductsStore((s) => s.products);
  const [hovered, setHovered] = useState(null);
  const [activeMaterial, setActiveMaterial] = useState(null);
  const [selected, setSelected] = useState({ material: null, pattern: null, color: null });

  const toggleSelected = (categoryKey, value) => {
    setSelected((prev) => ({
      ...prev,
      [categoryKey]: prev[categoryKey] === value ? null : value,
    }));
  };

  const handleMaterialClick = (swatch) => {
    toggleSelected('material', swatch.value);
    setActiveMaterial((prev) => (prev?.value === swatch.value ? null : swatch));
  };

  const matches = useMemo(() => {
    return products.filter(
      (p) =>
        (!selected.material || p.material === selected.material) &&
        (!selected.pattern || p.pattern === selected.pattern) &&
        (!selected.color || p.color === selected.color),
    );
  }, [products, selected]);

  const hasSelection = Object.values(selected).some(Boolean);

  return (
    <section className="h007-fabric">
      <div className="h007-content h007-fabric__inner">
        <h2 className="h007-section-title">THE FABRIC</h2>
        <p className="h007-section-subcopy">Every great suit starts with the right fabric.</p>

        <div className="h007-fabric__categories">
          {FABRIC_CATEGORIES.map((category) => (
            <div className="h007-fabric__category" key={category.key}>
              <span className="h007-fabric__category-label h007-label">{category.label}</span>
              <div className="h007-fabric__swatches">
                {category.swatches.map((swatch) => {
                  const isSelected = selected[category.key] === swatch.value;
                  const isMaterial = category.key === 'material';
                  return (
                    <button
                      type="button"
                      key={swatch.value}
                      className={`h007-fabric__swatch ${isMaterial ? 'h007-fabric__swatch--texture' : ''} ${isSelected ? 'h007-fabric__swatch--selected' : ''}`}
                      onMouseEnter={() => setHovered(swatch)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => (isMaterial ? handleMaterialClick(swatch) : category.filterable && toggleSelected(category.key, swatch.value))}
                    >
                      {isMaterial ? (
                        <>
                          <ProductPlaceholder name={swatch.title} src={swatch.image} className="h007-fabric__swatch-thumb" />
                          <span className="h007-fabric__swatch-label">{swatch.title}</span>
                        </>
                      ) : (
                        swatch.value
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="h007-fabric__preview">
          {activeMaterial ? (
            <>
              <div className="h007-fabric__preview-image">
                <ProductPlaceholder name={activeMaterial.title} src={activeMaterial.image} />
              </div>
              <dl className="h007-fabric__preview-meta">
                <div>
                  <dt className="h007-label">MATERIAL</dt>
                  <dd>{activeMaterial.title}</dd>
                </div>
                <div>
                  <dt className="h007-label">PATTERN</dt>
                  <dd>{activeMaterial.previewPattern}</dd>
                </div>
                <div>
                  <dt className="h007-label">COLOR</dt>
                  <dd>{activeMaterial.previewColor}</dd>
                </div>
                <div>
                  <dt className="h007-label">FINISH</dt>
                  <dd>{activeMaterial.previewFinish}</dd>
                </div>
              </dl>
            </>
          ) : hovered ? (
            <>
              <span className="h007-fabric__preview-title">{hovered.title}</span>
              <span className="h007-fabric__preview-info">{hovered.info}</span>
            </>
          ) : (
            <span className="h007-fabric__preview-info">Hover a swatch, or click a material for a full preview.</span>
          )}
        </div>

        {hasSelection && (
          <div className="h007-fabric__matches">
            <span className="h007-fabric__matches-count h007-label">
              {matches.length} {matches.length === 1 ? 'SUIT MATCHES' : 'SUITS MATCH'} THIS FABRIC
            </span>
            <div className="h007-fabric__matches-list">
              {matches.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="h007-fabric__matches-item">
                  {product.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default FabricSection;
