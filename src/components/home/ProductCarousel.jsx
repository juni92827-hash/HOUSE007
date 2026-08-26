import { useCallback, useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard.jsx';
import './product-carousel.css';

const VISIBLE = 3;
const CARD_WIDTH = 570;
const GAP = 24;
const STEP = CARD_WIDTH + GAP;
const AUTOPLAY_MS = 5000;
const DRAG_THRESHOLD = 80;

/**
 * ProductCarousel — THE HOUSE COLLECTION. Infinite loop over the full
 * product list, 3 cards visible, autoplay every 5s (paused on hover),
 * mouse drag, and Prev/Next buttons. Uses a clone-and-jump technique so the
 * loop is seamless in both directions.
 *
 * @param {Array} products - full product list (8 items) [Required]
 */
function ProductCarousel({ products }) {
  const extended = [...products.slice(-VISIBLE), ...products, ...products.slice(0, VISIBLE)];
  const [index, setIndex] = useState(VISIBLE);
  const [withTransition, setWithTransition] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [dragDeltaX, setDragDeltaX] = useState(0);
  const dragState = useRef({ isDragging: false, startX: 0 });

  const goNext = useCallback(() => {
    setWithTransition(true);
    setIndex((i) => i + 1);
  }, []);

  const goPrev = useCallback(() => {
    setWithTransition(true);
    setIndex((i) => i - 1);
  }, []);

  useEffect(() => {
    if (isPaused) return undefined;
    const timer = setInterval(goNext, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [isPaused, goNext]);

  const handleTransitionEnd = () => {
    if (index >= VISIBLE + products.length) {
      setWithTransition(false);
      setIndex(index - products.length);
    } else if (index < VISIBLE) {
      setWithTransition(false);
      setIndex(index + products.length);
    }
  };

  const onPointerDown = (e) => {
    dragState.current = { isDragging: true, startX: e.clientX };
    setWithTransition(false);
  };

  const onPointerMove = (e) => {
    if (!dragState.current.isDragging) return;
    setDragDeltaX(e.clientX - dragState.current.startX);
  };

  const endDrag = () => {
    if (!dragState.current.isDragging) return;
    dragState.current.isDragging = false;
    setWithTransition(true);

    if (dragDeltaX <= -DRAG_THRESHOLD) {
      setIndex((i) => i + 1);
    } else if (dragDeltaX >= DRAG_THRESHOLD) {
      setIndex((i) => i - 1);
    }
    setDragDeltaX(0);
  };

  const translateX = -(index * STEP) + dragDeltaX;

  return (
    <div
      className="h007-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        endDrag();
      }}
    >
      <div
        className="h007-carousel__viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
      >
        <div
          className="h007-carousel__track"
          style={{
            transform: `translateX(${translateX}px)`,
            transition: withTransition ? 'transform 560ms var(--h007-ease-out)' : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extended.map((product, i) => (
            <div className="h007-carousel__item" key={`${product.id}-${i}`}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <button type="button" className="h007-nav-text h007-carousel__nav h007-carousel__nav--prev" onClick={goPrev}>
        PREVIOUS
      </button>
      <button type="button" className="h007-nav-text h007-carousel__nav h007-carousel__nav--next" onClick={goNext}>
        NEXT
      </button>
    </div>
  );
}

export default ProductCarousel;
