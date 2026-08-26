import { useNavigate } from 'react-router-dom';
import ModalOverlay from '../common/ModalOverlay.jsx';
import { useCartStore } from '../../stores/cartStore';
import { formatPrice } from '../../utils/format';
import '../common/forms.css';
import './bag-panel.css';

function BagPanel() {
  const isOpen = useCartStore((s) => s.isMiniBagOpen);
  const closeMiniBag = useCartStore((s) => s.closeMiniBag);
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());
  const navigate = useNavigate();

  if (!isOpen) return null;

  const goToCheckout = () => {
    closeMiniBag();
    navigate('/checkout');
  };

  return (
    <ModalOverlay onClose={closeMiniBag} align="right">
      <button type="button" className="h007-modal-close" onClick={closeMiniBag}>
        CLOSE
      </button>
      <h2 className="h007-modal-title">YOUR BAG</h2>

      {items.length === 0 ? (
        <p className="h007-modal-subtitle">Your bag is empty.</p>
      ) : (
        <>
          <div className="h007-bag__items">
            {items.map((item) => (
              <div className="h007-bag__item" key={`${item.productId}-${item.size}`}>
                <div className="h007-bag__item-info">
                  <span className="h007-bag__item-name">{item.name}</span>
                  <span className="h007-bag__item-meta">SIZE {item.size}</span>
                  <span className="h007-bag__item-price">{formatPrice(item.price)}</span>
                </div>
                <div className="h007-bag__item-controls">
                  <div className="h007-bag__qty">
                    <button type="button" onClick={() => updateQty(item.productId, item.size, item.qty - 1)}>
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button type="button" onClick={() => updateQty(item.productId, item.size, item.qty + 1)}>
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="h007-text-link-button"
                    onClick={() => removeItem(item.productId, item.size)}
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="h007-bag__summary">
            <div className="h007-bag__summary-row">
              <span>SUBTOTAL</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <button type="button" className="h007-primary-button" onClick={goToCheckout}>
              CHECKOUT
            </button>
          </div>
        </>
      )}
    </ModalOverlay>
  );
}

export default BagPanel;
