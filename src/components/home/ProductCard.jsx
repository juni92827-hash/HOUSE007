import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductPlaceholder from '../common/ProductPlaceholder.jsx';
import FloatingStylingPreview from './FloatingStylingPreview.jsx';
import { useWishlistStore } from '../../stores/wishlistStore';
import { formatPrice } from '../../utils/format';
import { getProductImagePath } from '../../utils/assetPaths';
import './product-card.css';

/**
 * ProductCard
 *
 * @param {object} product - a row from productsStore (with sizes/totalStock) [Required]
 */
function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  const updatePreviewPosition = (e) => {
    setPreviewPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      className="h007-product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={updatePreviewPosition}
    >
      <Link to={`/product/${product.id}`} className="h007-product-card__image-link">
        <div className={`h007-product-card__image ${isHovered ? 'h007-product-card__image--hover' : ''}`}>
          <ProductPlaceholder name={product.name} view={product.images?.[0]} src={getProductImagePath(product, 'front')} />
          <div className="h007-product-card__image h007-product-card__image--secondary">
            <ProductPlaceholder name={product.name} view={product.images?.[1]} src={getProductImagePath(product, 'side')} />
          </div>
        </div>
        {isHovered && <span className="h007-product-card__view">VIEW SUIT</span>}
      </Link>

      <div className="h007-product-card__info">
        <div>
          <p className="h007-product-card__name">{product.name}</p>
          {isHovered && <p className="h007-product-card__style h007-label">{product.style}</p>}
        </div>
        <p className="h007-product-card__price">{formatPrice(product.price)}</p>
      </div>

      <button
        type="button"
        className="h007-nav-text h007-product-card__wishlist"
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product.id);
        }}
      >
        {isWishlisted ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
      </button>

      <FloatingStylingPreview
        productName={product.name}
        stylingSet={product.styling_set ?? []}
        position={previewPosition}
        isVisible={isHovered}
      />
    </div>
  );
}

export default ProductCard;
