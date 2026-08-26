import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { useAddressesStore } from '../stores/addressesStore';
import { useOrdersStore } from '../stores/ordersStore';
import { useProductsStore } from '../stores/productsStore';
import { useUiStore } from '../stores/uiStore';
import { formatPrice } from '../utils/format';
import '../components/common/forms.css';
import '../components/modals/bag-panel.css';
import './checkout-page.css';

const emptyAddress = { addressName: '', postalCode: '', address: '', detailAddress: '', deliveryRequest: '' };

function CheckoutPage() {
  const user = useAuthStore((s) => s.user);
  const openLogin = useUiStore((s) => s.openLogin);
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
        <p className="h007-modal-title">LOGIN TO CHECKOUT</p>
        <p className="h007-modal-subtitle">Only House clients can place an order.</p>
        <button type="button" className="h007-primary-button" style={{ width: 240 }} onClick={openLogin}>
          LOGIN
        </button>
      </main>
    );
  }

  if (completedOrder) {
    return (
      <main className="h007-checkout h007-checkout--empty">
        <p className="h007-modal-title">ORDER COMPLETE</p>
        <p className="h007-modal-subtitle">Order {completedOrder.order_number} has been placed.</p>
        <Link to="/my-house" className="h007-primary-button" style={{ width: 240, textAlign: 'center' }}>
          VIEW MY ORDERS
        </Link>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="h007-checkout h007-checkout--empty">
        <p className="h007-modal-title">YOUR BAG IS EMPTY</p>
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
            <h2 className="h007-section-title">DELIVERY ADDRESS</h2>
            <div className="h007-checkout__address-list">
              {addresses.map((address) => (
                <label key={address.id} className="h007-checkbox-row">
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
                  <span className="h007-field__label">ADDRESS NAME</span>
                  <input
                    className="h007-field__input"
                    value={newAddress.addressName}
                    onChange={(e) => setNewAddress((a) => ({ ...a, addressName: e.target.value }))}
                  />
                </label>
                <label className="h007-field">
                  <span className="h007-field__label">POSTAL CODE</span>
                  <input
                    className="h007-field__input"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress((a) => ({ ...a, postalCode: e.target.value }))}
                  />
                </label>
                <label className="h007-field">
                  <span className="h007-field__label">ADDRESS</span>
                  <input
                    className="h007-field__input"
                    value={newAddress.address}
                    onChange={(e) => setNewAddress((a) => ({ ...a, address: e.target.value }))}
                  />
                </label>
                <label className="h007-field">
                  <span className="h007-field__label">DETAIL ADDRESS</span>
                  <input
                    className="h007-field__input"
                    value={newAddress.detailAddress}
                    onChange={(e) => setNewAddress((a) => ({ ...a, detailAddress: e.target.value }))}
                  />
                </label>
                <label className="h007-field">
                  <span className="h007-field__label">DELIVERY REQUEST</span>
                  <input
                    className="h007-field__input"
                    value={newAddress.deliveryRequest}
                    onChange={(e) => setNewAddress((a) => ({ ...a, deliveryRequest: e.target.value }))}
                  />
                </label>
                <button type="button" className="h007-primary-button" onClick={handleSaveAddress}>
                  SAVE ADDRESS
                </button>
              </div>
            ) : (
              <button type="button" className="h007-text-link-button" onClick={() => setIsAddingAddress(true)}>
                ADD NEW ADDRESS
              </button>
            )}
          </section>

          <section className="h007-checkout__section">
            <h2 className="h007-section-title">PAYMENT</h2>
            <p className="h007-section-subcopy">CREDIT CARD</p>
            <div className="h007-checkout__payment-fields">
              <label className="h007-field">
                <span className="h007-field__label">CARD NUMBER</span>
                <input className="h007-field__input" placeholder="0000 0000 0000 0000" />
              </label>
              <div className="h007-field-row">
                <label className="h007-field">
                  <span className="h007-field__label">EXPIRY</span>
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
          <h2 className="h007-section-title">REVIEW</h2>
          <div className="h007-checkout__items">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="h007-checkout__item">
                <span>
                  {item.name} — SIZE {item.size} × {item.qty}
                </span>
                <span>{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="h007-bag__summary-row" style={{ marginTop: 20 }}>
            <span>TOTAL</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {placeError && <p className="h007-form-error">{placeError}</p>}
          <button
            type="button"
            className="h007-primary-button"
            disabled={!selectedAddress || isPlacing}
            onClick={handlePlaceOrder}
          >
            PLACE ORDER
          </button>
        </aside>
      </div>
    </main>
  );
}

export default CheckoutPage;
