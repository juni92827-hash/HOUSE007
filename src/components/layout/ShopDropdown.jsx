import { Link } from 'react-router-dom';
import { useProductsStore } from '../../stores/productsStore';

const STYLE_CATEGORIES = ['Business', 'Formal', 'Bespoke'];

/**
 * ShopDropdown
 *
 * @param {function} onNavigate - called after a link inside the dropdown is clicked [Required]
 */
function ShopDropdown({ onNavigate }) {
  const products = useProductsStore((s) => s.products);
  const suits = products.slice(0, 3);

  return (
    <div className="h007-shop-dropdown">
      <div className="h007-shop-dropdown__column">
        <span className="h007-shop-dropdown__heading">SUITS</span>
        {suits.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="h007-shop-dropdown__item"
            onClick={onNavigate}
          >
            {product.name}
          </Link>
        ))}
      </div>
      <div className="h007-shop-dropdown__column">
        <span className="h007-shop-dropdown__heading">STYLE</span>
        {STYLE_CATEGORIES.map((style) => (
          <Link
            key={style}
            to="/home#collection"
            className="h007-shop-dropdown__item"
            onClick={onNavigate}
          >
            {style}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ShopDropdown;
