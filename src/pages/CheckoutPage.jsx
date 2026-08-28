import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { useAddressesStore } from '../stores/addressesStore';
import { useOrdersStore } from '../stores/ordersStore';
import { useProductsStore } from '../stores/productsStore';
import { formatPrice } from '../utils/format';
import '../components/common/forms.css';
import '../components/modals/bag-panel.css';
import './checkout-page.css';

const emptyAddress = { addressName: '', postalCode: '', address: '', detailAddress: '', deliveryRequest: '' };

function CheckoutPage() {
  const user = useAuthStore((s) => s.user);
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clear);
  const refreshStock = useProductsStore((s) => s.refreshStock);

  const addresses = useAddressesStore((s) => s.addresses);
  const loadAddresses = useAddressesStore((s) => s.loadAddresses);
  const addAddress = useAddressesStore((s) => s.addAddress);

  const placeOrder = useOrdersStore((s) => s.placeOrder);
  const placeError = useOrdersStore((s) => s.placeError);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState(emptyAddress);
  const [isPlacing, setIsPlacing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) loadAddresses(user.id);
  }, [user, loadAddresses]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  if (!user) {
    return (
      <main className="h007-checkout h007-checkout--empty">
        <p className="h007-modal-title h007-font-kr">주문하려면 로그인해 주세요</p>
        <p className="h007-modal-subtitle h007-font-kr">House 클라이언트만 주문할 수 있습니다.</p>
        <button
          type="button"
          className="h007-primary-button h007-font-kr"
          style={{ width: 240 }}
          onClick={() => navigate('/login', { state: { from: '/checkout' } })}
        >
          로그인
        </button>
      </main>
    );
  }

  if (completedOrder) {
    return (
      <main className="h007-checkout h007-checkout--empty">
        <p className="h007-modal-title h007-font-kr">주문 완료</p>
        <p className="h007-modal-subtitle h007-font-kr">주문 {completedOrder.order_number}이(가) 접수되었습니다.</p>
        <Link to="/my-house" className="h007-primary-button h007-font-kr" style={{ width: 240, textAlign: 'center' }}>
          주문 내역 보기
        </Link>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="h007-checkout h007-checkout--empty">
        <p className="h007-modal-title h007-font-kr">장바구니가 비어 있습니다</p>
        <Link to="/home#collection" className="h007-text-link-button">
          RETURN TO THE COLLECTION
        </Link>
      </main>
    );
  }

  const handleSaveAddress = async () => {
    if (!newAddress.postalCode || !newAddress.address) return;
    const saved = await addAddress(user.id, {
      address_name: newAddress.addressName || 'Home',
      postal_code: newAddress.postalCode,
      address: newAddress.address,
      detail_address: newAddress.detailAddress,
      delivery_request: newAddress.deliveryRequest,
      is_default: addresses.length === 0,
    });
    if (saved) {
      setSelectedAddressId(saved.id);
      setIsAddingAddress(false);
      setNewAddress(emptyAddress);
    }
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return;
    setIsPlacing(true);
    const result = await placeOrder(items, {
      address_name: selectedAddress.address_name,
      postal_code: selectedAddress.postal_code,
      address: selectedAddress.address,
      detail_address: selectedAddress.detail_address,
      delivery_request: selectedAddress.delivery_request,
    });
    setIsPlacing(false);
    if (result.ok) {
      clearCart();
      refreshStock();
      setCompletedOrder(result.order);
    }
  };

  return (
    <main className="h007-checkout">
      <div className="h007-content h007-checkout__layout">
        <div className="h007-checkout__main">
          <section className="h007-checkout__section">
            <h2 className="h007-section-title h007-font-kr">배송지</h2>
            <div className="h007-checkout__address-list">
              {addresses.map((address) => (
                <label key={address.id} className="h007-checkbox-row h007-font-kr">
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === address.id}
                    onChange={() => setSelectedAddressId(address.id)}
                  />
                  {address.address_name} — {address.address} {address.detail_address}
                </label>
              ))}
            </div>

            {isAddingAddress ? (
              <div className="h007-checkout__new-address">
                <label className="h007-field">
                  <span className="h007-field__label h007-font-kr">주소 이름</span>
                  <input
                    className="h007-field__input"
                    value={newAddress.addressName}
                    onChange={(e) => setNewAddress((a) => ({ ...a, addressName: e.target.value }))}
                  />
                </label>
                <label className="h007-field">
                  <span className="h007-field__label h007-font-kr">우편번호</span>
                  <input
                    className="h007-field__input"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress((a) => ({ ...a, postalCode: e.target.value }))}
                  />
                </label>
                <label className="h007-field">
                  <span className="h007-field__label h007-font-kr">주소</span>
                  <input
                    className="h007-field__input"
                    value={newAddress.address}
                    onChange={(e) => setNewAddress((a) => ({ ...a, address: e.target.value }))}
                  />
                </label>
                <label className="h007-field">
                  <span className="h007-field__label h007-font-kr">상세주소</span>
                  <input
                    className="h007-field__input"
                    value={newAddress.detailAddress}
                    onChange={(e) => setNewAddress((a) => ({ ...a, detailAddress: e.target.value }))}
                  />
                </label>
                <label className="h007-field">
                  <span className="h007-field__label h007-font-kr">배송 요청사항</span>
                  <input
                    className="h007-field__input"
                    value={newAddress.deliveryRequest}
                    onChange={(e) => setNewAddress((a) => ({ ...a, deliveryRequest: e.target.value }))}
                  />
                </label>
                <button type="button" className="h007-primary-button h007-font-kr" onClick={handleSaveAddress}>
                  주소 저장
                </button>
              </div>
            ) : (
              <button type="button" className="h007-text-link-button h007-font-kr" onClick={() => setIsAddingAddress(true)}>
                새 주소 추가
              </button>
            )}
          </section>

          <section className="h007-checkout__section">
            <h2 className="h007-section-title h007-font-kr">결제</h2>
            <p className="h007-section-subcopy h007-font-kr">신용카드</p>
            <div className="h007-checkout__payment-fields">
              <label className="h007-field">
                <span className="h007-field__label h007-font-kr">카드 번호</span>
                <input className="h007-field__input" placeholder="0000 0000 0000 0000" />
              </label>
              <div className="h007-field-row">
                <label className="h007-field">
                  <span className="h007-field__label h007-font-kr">유효기간</span>
                  <input className="h007-field__input" placeholder="MM/YY" />
                </label>
                <label className="h007-field">
                  <span className="h007-field__label">CVC</span>
                  <input className="h007-field__input" placeholder="000" />
                </label>
              </div>
            </div>
          </section>
        </div>

        <aside className="h007-checkout__summary">
          <h2 className="h007-section-title h007-font-kr">주문 확인</h2>
          <div className="h007-checkout__items">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="h007-checkout__item h007-font-kr">
                <span>
                  {item.name} — 사이즈 {item.size} × {item.qty}
                </span>
                <span>{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="h007-bag__summary-row h007-font-kr" style={{ marginTop: 20 }}>
            <span>합계</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {placeError && <p className="h007-form-error">{placeError}</p>}
          <button
            type="button"
            className="h007-primary-button h007-font-kr"
            disabled={!selectedAddress || isPlacing}
            onClick={handlePlaceOrder}
          >
            주문하기
          </button>
        </aside>
      </div>
    </main>
  );
}

export default CheckoutPage;
