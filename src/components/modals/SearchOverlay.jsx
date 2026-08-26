import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../stores/uiStore';
import { useProductsStore } from '../../stores/productsStore';
import { formatPrice } from '../../utils/format';
import '../common/forms.css';
import './search-overlay.css';

function SearchOverlay() {
  const isOpen = useUiStore((s) => s.isSearchOpen);
  const closeSearch = useUiStore((s) => s.closeSearch);
  const products = useProductsStore((s) => s.products);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) =>
      [p.name, p.style, p.material, p.color, p.pattern].some((field) =>
        field?.toLowerCase().includes(q),
      ),
    );
  }, [products, query]);

  if (!isOpen) return null;

  const goToProduct = (id) => {
    setQuery('');
    closeSearch();
    navigate(`/product/${id}`);
  };

  return (
    <div className="h007-search-overlay" onClick={closeSearch}>
      <div className="h007-search-overlay__panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="h007-modal-close" onClick={closeSearch}>
          CLOSE
        </button>

        <input
          autoFocus
          type="text"
          className="h007-search-overlay__input"
          placeholder="SEARCH THE COLLECTION"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {query.trim() && results.length === 0 && (
          <p className="h007-search-overlay__empty">No results for "{query}".</p>
        )}

        <div className="h007-search-overlay__results">
          {results.map((product) => (
            <button
              type="button"
              key={product.id}
              className="h007-search-overlay__result"
              onClick={() => goToProduct(product.id)}
            >
              <span className="h007-search-overlay__result-name">{product.name}</span>
              <span className="h007-search-overlay__result-meta">
                {product.style} · {formatPrice(product.price)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchOverlay;
