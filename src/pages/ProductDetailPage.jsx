import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProductPlaceholder from '../components/common/ProductPlaceholder.jsx';
import { useProductsStore } from '../stores/productsStore';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { formatPrice } from '../utils/format';
import { getProductImagePath, getStylingImagePath } from '../utils/assetPaths';
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

  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
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
    if (!info || info.stock === 0) return '품절';
    if (info.stock <= 3) return `${info.stock}개 남음`;
    return '재고 있음';
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
      <section className="h007-pd-section h007-pd-hero">
        <ProductPlaceholder
          name={product.name}
          view={product.images?.[0]}
          src={getProductImagePath(product, 'front')}
          className="h007-pd-hero__image"
        />
      </section>

      <section className="h007-pd-section h007-pd-info h007-content">
        <h1 className="h007-product-detail__name">{product.name}</h1>
        <p className="h007-product-detail__style">{product.style}</p>
        <p className="h007-product-detail__price">{formatPrice(product.price)}</p>
        <p className="h007-product-detail__description">{product.description}</p>
      </section>

      <section className="h007-pd-section h007-pd-material h007-content">
        <div className="h007-pd-material__image">
          <ProductPlaceholder
            name={product.name}
            view={product.images?.[4]}
            src={getProductImagePath(product, 'fabric')}
          />
        </div>
        <div className="h007-pd-material__info">
          <span className="h007-field__label h007-font-kr">소재</span>
          <p className="h007-pd-material__name">{product.material}</p>
          <p className="h007-pd-material__meta">
            {product.pattern} · {product.color}
          </p>
        </div>
      </section>

      <section className="h007-pd-section h007-pd-detail h007-content">
        <div className="h007-pd-detail__info">
          <span className="h007-field__label h007-font-kr">핏</span>
          <p className="h007-pd-detail__value">{product.fit}</p>
        </div>
        <div className="h007-pd-detail__image">
          <ProductPlaceholder
            name={product.name}
            view={product.images?.[3]}
            src={getProductImagePath(product, 'detail')}
          />
        </div>
      </section>

      <section className="h007-pd-section h007-pd-styling">
        <ProductPlaceholder
          name={product.name}
          view="STYLING"
          src={getStylingImagePath(product.name)}
          className="h007-pd-styling__image"
        />
      </section>

      <section className="h007-pd-section h007-pd-purchase h007-content">
        <div className="h007-product-detail__sizes">
          <span className="h007-field__label h007-font-kr">사이즈</span>
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
          {selectedSize && (
            <p className="h007-product-detail__stock-label h007-font-kr">{stockLabel({ size: selectedSize })}</p>
          )}
        </div>

        {canAdd && (
          <div className="h007-product-detail__qty">
            <span className="h007-field__label h007-font-kr">수량</span>
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
          <button type="button" className="h007-primary-button h007-font-kr" disabled={!canAdd} onClick={handleAddToBag}>
            {canAdd ? '장바구니 담기' : selectedSize ? '품절' : '사이즈를 선택해 주세요'}
          </button>
          <button type="button" className="h007-primary-button h007-font-kr" disabled={!canAdd} onClick={handleBuyNow}>
            바로 구매
          </button>
          <button
            type="button"
            className="h007-text-link-button h007-font-kr"
            onClick={() => toggleWishlist(product.id)}
          >
            {isWishlisted ? '위시리스트 제거' : '위시리스트 추가'}
          </button>
        </div>
      </section>

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
