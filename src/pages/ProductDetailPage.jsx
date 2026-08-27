import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProductPlaceholder from '../components/common/ProductPlaceholder.jsx';
import { useProductsStore } from '../stores/productsStore';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { formatPrice } from '../utils/format';
import { PRODUCT_GALLERY_VIEWS, getProductImagePath } from '../utils/assetPaths';
import '../components/common/forms.css';
import '../components/modals/bag-panel.css';
import './product-detail-page.css';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const products = useProductsStore((s) => s.products);
  const status = useProductsStore((s) => s.status);
  const product = useProductsStore((s) => s.getById(id));

  const addItem = useCartStore((s) => s.addItem);
  const isWishlisted = useWishlistStore((s) => (product ? s.isWishlisted(product.id) : false));
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setActiveImage(0);
    setSelectedSize(null);
    setQty(1);
  }, [id]);

  if (status === 'loaded' && !product) {
    return (
      <main className="h007-product-detail h007-product-detail--empty">
        <p className="h007-modal-subtitle">PRODUCT UNAVAILABLE</p>
        <Link to="/home" className="h007-text-link-button">
          RETURN TO THE COLLECTION
        </Link>
      </main>
    );
  }

  if (!product) return null;

  const sizeInfo = product.sizes?.find((s) => s.size === selectedSize);
  const maxQty = sizeInfo?.stock ?? 0;
  const canAdd = !!selectedSize && maxQty > 0;

  const stockLabel = (size) => {
    const info = product.sizes?.find((s) => s.size === size.size);
    if (!info || info.stock === 0) return 'SOLD OUT';
    if (info.stock <= 3) return `ONLY ${info.stock} LEFT`;
    return 'IN STOCK';
  };

  const buildCartItem = () => ({
    productId: product.id,
    name: product.name,
    price: product.price,
    size: selectedSize,
    qty,
    maxStock: maxQty,
  });

  const handleAddToBag = () => {
    if (!canAdd) return;
    addItem(buildCartItem());
  };

  const handleBuyNow = () => {
    if (!canAdd) return;
    addItem(buildCartItem());
    navigate('/checkout');
  };

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <main className="h007-product-detail">
      <div className="h007-content h007-product-detail__layout">
        <div className="h007-product-detail__gallery">
          <div className="h007-product-detail__main-image">
            <ProductPlaceholder
              key={activeImage}
              name={product.name}
              view={product.images?.[activeImage]}
              src={getProductImagePath(product, PRODUCT_GALLERY_VIEWS[activeImage] ?? 'front')}
            />
          </div>
          <div className="h007-product-detail__thumbnails">
            {(product.images ?? []).map((view, i) => (
              <button
                type="button"
                key={view}
                className={`h007-product-detail__thumbnail ${activeImage === i ? 'h007-product-detail__thumbnail--active' : ''}`}
                onClick={() => setActiveImage(i)}
              >
                <ProductPlaceholder
                  name={product.name}
                  view={view}
                  src={getProductImagePath(product, PRODUCT_GALLERY_VIEWS[i] ?? 'front')}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="h007-product-detail__info">
          <h1 className="h007-product-detail__name">{product.name}</h1>
          <p className="h007-product-detail__style">{product.style}</p>
          <p className="h007-product-detail__price">{formatPrice(product.price)}</p>

          <p className="h007-product-detail__description">{product.description}</p>

          <dl className="h007-product-detail__specs">
            <div>
              <dt>MATERIAL</dt>
              <dd>{product.material}</dd>
            </div>
            <div>
              <dt>PATTERN</dt>
              <dd>{product.pattern}</dd>
            </div>
            <div>
              <dt>COLOR</dt>
              <dd>{product.color}</dd>
            </div>
            <div>
              <dt>FIT</dt>
              <dd>{product.fit}</dd>
            </div>
          </dl>

          <div className="h007-product-detail__sizes">
            <span className="h007-field__label">SIZE</span>
            <div className="h007-product-detail__size-list">
              {product.sizes?.map((size) => {
                const soldOut = size.stock === 0;
                return (
                  <button
                    type="button"
                    key={size.size}
                    disabled={soldOut}
                    className={`h007-product-detail__size ${selectedSize === size.size ? 'h007-product-detail__size--selected' : ''} ${soldOut ? 'h007-product-detail__size--soldout' : ''}`}
                    onClick={() => {
                      setSelectedSize(size.size);
                      setQty(1);
                    }}
                  >
                    {size.size}
                  </button>
                );
              })}
            </div>
            {selectedSize && <p className="h007-product-detail__stock-label">{stockLabel({ size: selectedSize })}</p>}
          </div>

          {canAdd && (
            <div className="h007-product-detail__qty">
              <span className="h007-field__label">QUANTITY</span>
              <div className="h007-bag__qty">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  −
                </button>
                <span>{qty}</span>
                <button type="button" onClick={() => setQty((q) => Math.min(maxQty, q + 1))}>
                  +
                </button>
              </div>
            </div>
          )}

          <div className="h007-product-detail__actions">
            <button type="button" className="h007-primary-button" disabled={!canAdd} onClick={handleAddToBag}>
              {canAdd ? 'ADD TO BAG' : selectedSize ? 'SOLD OUT' : 'SELECT A SIZE'}
            </button>
            <button type="button" className="h007-primary-button" disabled={!canAdd} onClick={handleBuyNow}>
              BUY NOW
            </button>
            <button
              type="button"
              className="h007-text-link-button"
              onClick={() => toggleWishlist(product.id)}
            >
              {isWishlisted ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
            </button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="h007-content h007-product-detail__related">
          <h2 className="h007-section-title">YOU MAY ALSO LIKE</h2>
          <div className="h007-product-detail__related-list">
            {relatedProducts.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="h007-product-detail__related-item">
                <div className="h007-product-detail__related-image">
                  <ProductPlaceholder name={p.name} view={p.images?.[0]} src={getProductImagePath(p, 'front')} />
                </div>
                <span>{p.name}</span>
                <span className="h007-product-detail__related-price">{formatPrice(p.price)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default ProductDetailPage;
