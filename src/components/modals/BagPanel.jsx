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
      <button type="button" className="h007-modal-close h007-font-kr" onClick={closeMiniBag}>
        닫기
      </button>
      <h2 className="h007-modal-title h007-font-kr">장바구니</h2>

      {items.length === 0 ? (
        <p className="h007-modal-subtitle h007-font-kr">장바구니가 비어 있습니다.</p>
      ) : (
        <>
          <div className="h007-bag__items">
            {items.map((item) => (
              <div className="h007-bag__item" key={`${item.productId}-${item.size}`}>
                <div className="h007-bag__item-info">
                  <span className="h007-bag__item-name">{item.name}</span>
                  <span className="h007-bag__item-meta h007-font-kr">사이즈 {item.size}</span>
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
                    className="h007-text-link-button h007-font-kr"
                    onClick={() => removeItem(item.productId, item.size)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="h007-bag__summary">
            <div className="h007-bag__summary-row h007-font-kr">
              <span>소계</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <button type="button" className="h007-primary-button h007-font-kr" onClick={goToCheckout}>
              주문하기
            </button>
          </div>
        </>
      )}
    </ModalOverlay>
  );
}

export default BagPanel;
