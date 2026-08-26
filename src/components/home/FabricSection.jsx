import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FABRIC_CATEGORIES } from '../../data/fabricData';
import { useProductsStore } from '../../stores/productsStore';
import './fabric-section.css';

/**
 * FabricSection — "THE FABRIC" interactive swatches. Material / Pattern /
 * Color selections filter the live product catalog so the connection is
 * real, not decorative (Finish is informational-only, matching the schema).
 */
function FabricSection() {
  const products = useProductsStore((s) => s.products);
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState({ material: null, pattern: null, color: null });

  const toggleSelected = (categoryKey, value) => {
    setSelected((prev) => ({
      ...prev,
      [categoryKey]: prev[categoryKey] === value ? null : value,
    }));
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
              <span className="h007-fabric__category-label">{category.label}</span>
              <div className="h007-fabric__swatches">
                {category.swatches.map((swatch) => {
                  const isSelected = selected[category.key] === swatch.value;
                  return (
                    <button
                      type="button"
                      key={swatch.value}
                      className={`h007-fabric__swatch ${isSelected ? 'h007-fabric__swatch--selected' : ''}`}
                      onMouseEnter={() => setHovered(swatch)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => category.filterable && toggleSelected(category.key, swatch.value)}
                    >
                      {swatch.value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="h007-fabric__preview">
          {hovered ? (
            <>
              <span className="h007-fabric__preview-title">{hovered.title}</span>
              <span className="h007-fabric__preview-info">{hovered.info}</span>
            </>
          ) : (
            <span className="h007-fabric__preview-info">Hover a swatch to see fabric details.</span>
          )}
        </div>

        {hasSelection && (
          <div className="h007-fabric__matches">
            <span className="h007-fabric__matches-count">
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
