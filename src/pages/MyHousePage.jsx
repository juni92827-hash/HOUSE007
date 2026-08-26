import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useOrdersStore } from '../stores/ordersStore';
import { useAddressesStore } from '../stores/addressesStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { useProductsStore } from '../stores/productsStore';
import { useClientFileStore } from '../stores/clientFileStore';
import { useUiStore } from '../stores/uiStore';
import { supabase } from '../lib/supabase';
import { computeOrderStatus, ORDER_STATUS_FLOW } from '../utils/orderStatus';
import { formatPrice } from '../utils/format';
import '../components/common/forms.css';
import '../components/modals/client-file-modal.css';
import './checkout-page.css';
import './my-house-page.css';

const TABS = ['MY ORDERS', 'WISHLIST', 'ADDRESS BOOK', 'CLIENT FILE'];
const emptyAddress = { addressName: '', postalCode: '', address: '', detailAddress: '', deliveryRequest: '' };

function MyHousePage() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const openLogoutConfirm = useUiStore((s) => s.openLogoutConfirm);

  const orders = useOrdersStore((s) => s.orders);
  const loadOrders = useOrdersStore((s) => s.loadOrders);

  const addresses = useAddressesStore((s) => s.addresses);
  const loadAddresses = useAddressesStore((s) => s.loadAddresses);
  const addAddress = useAddressesStore((s) => s.addAddress);
  const removeAddress = useAddressesStore((s) => s.removeAddress);

  const wishlistIds = useWishlistStore((s) => s.productIds);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const products = useProductsStore((s) => s.products);

  const openClientFile = useClientFileStore((s) => s.openClientFile);

  const [activeTab, setActiveTab] = useState('MY ORDERS');
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState(emptyAddress);
  const [clientProfile, setClientProfile] = useState(undefined);

  useEffect(() => {
    if (!user) return;
    loadOrders(user.id);
    loadAddresses(user.id);
    supabase
      .from('client_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => setClientProfile(data ?? null));
  }, [user, loadOrders, loadAddresses]);

  if (!user) {
    return (
      <main className="h007-my-house h007-my-house--empty">
        <p className="h007-modal-title">MY HOUSE IS FOR CLIENTS</p>
        <p className="h007-modal-subtitle">Login to view your orders, wishlist, and Client File.</p>
      </main>
    );
  }

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  const handleSaveAddress = async () => {
    if (!newAddress.postalCode || !newAddress.address) return;
    await addAddress(user.id, {
      address_name: newAddress.addressName || 'Home',
      postal_code: newAddress.postalCode,
      address: newAddress.address,
      detail_address: newAddress.detailAddress,
      delivery_request: newAddress.deliveryRequest,
      is_default: addresses.length === 0,
    });
    setIsAddingAddress(false);
    setNewAddress(emptyAddress);
  };

  const trackedOrder = orders.find((o) => o.id === trackingOrderId);

  return (
    <main className="h007-my-house">
      <div className="h007-content h007-my-house__layout">
        <aside className="h007-my-house__sidebar">
          <p className="h007-my-house__welcome">
            {profile?.first_name ? `MR. ${profile.last_name?.toUpperCase()}` : 'WELCOME'}
          </p>
          <nav className="h007-my-house__nav">
            {TABS.map((tab) => (
              <button
                type="button"
                key={tab}
                className={`h007-nav-text h007-my-house__nav-item ${activeTab === tab ? 'h007-my-house__nav-item--active' : ''}`}
                onClick={() => {
                  setActiveTab(tab);
                  setTrackingOrderId(null);
                }}
              >
                {tab}
              </button>
            ))}
            <button type="button" className="h007-nav-text h007-my-house__nav-item" onClick={openLogoutConfirm}>
              LOG OUT
            </button>
          </nav>
        </aside>

        <div className="h007-my-house__content">
          {activeTab === 'MY ORDERS' && (
            <section>
              <h2 className="h007-section-title">MY ORDERS</h2>
              {orders.length === 0 && <p className="h007-modal-subtitle">You have no orders yet.</p>}

              {trackedOrder ? (
                <div className="h007-my-house__tracking">
                  <button type="button" className="h007-text-link-button" onClick={() => setTrackingOrderId(null)}>
                    ← BACK TO ORDERS
                  </button>
                  <p className="h007-modal-subtitle" style={{ marginTop: 16 }}>
                    ORDER {trackedOrder.order_number}
                  </p>
                  <div className="h007-my-house__status-flow">
                    {ORDER_STATUS_FLOW.map((status) => {
                      const currentStatus = computeOrderStatus(trackedOrder.created_at);
                      const reached =
                        ORDER_STATUS_FLOW.indexOf(status) <= ORDER_STATUS_FLOW.indexOf(currentStatus);
                      return (
                        <span
                          key={status}
                          className={`h007-my-house__status-step ${reached ? 'h007-my-house__status-step--reached' : ''}`}
                        >
                          {status}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="h007-my-house__orders">
                  {orders.map((order) => (
                    <div key={order.id} className="h007-my-house__order">
                      <div className="h007-my-house__order-header">
                        <span>ORDER {order.order_number}</span>
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                        <span>{computeOrderStatus(order.created_at).toUpperCase()}</span>
                      </div>
                      {order.items.map((item) => (
                        <div key={item.id} className="h007-checkout__item">
                          <span>
                            {item.product_name} — SIZE {item.size} × {item.qty}
                          </span>
                          <span>{formatPrice(item.unit_price * item.qty)}</span>
                        </div>
                      ))}
                      <div className="h007-my-house__order-footer">
                        <span>TOTAL {formatPrice(order.total)}</span>
                        <button
                          type="button"
                          className="h007-text-link-button"
                          onClick={() => setTrackingOrderId(order.id)}
                        >
                          TRACK ORDER
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'WISHLIST' && (
            <section>
              <h2 className="h007-section-title">WISHLIST</h2>
              {wishlistProducts.length === 0 && <p className="h007-modal-subtitle">Your wishlist is empty.</p>}
              <div className="h007-my-house__wishlist">
                {wishlistProducts.map((product) => (
                  <div key={product.id} className="h007-my-house__wishlist-item">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                    <span>{formatPrice(product.price)}</span>
                    <button type="button" className="h007-text-link-button" onClick={() => toggleWishlist(product.id)}>
                      REMOVE
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'ADDRESS BOOK' && (
            <section>
              <h2 className="h007-section-title">ADDRESS BOOK</h2>
              <div className="h007-my-house__addresses">
                {addresses.map((address) => (
                  <div key={address.id} className="h007-my-house__address">
                    <span>
                      {address.address_name} — {address.address} {address.detail_address}
                    </span>
                    <button type="button" className="h007-text-link-button" onClick={() => removeAddress(address.id)}>
                      REMOVE
                    </button>
                  </div>
                ))}
              </div>

              {isAddingAddress ? (
                <div className="h007-checkout__new-address" style={{ marginTop: 24 }}>
                  <label className="h007-field">
                    <span className="h007-field__label">ADDRESS NAME</span>
                    <input className="h007-field__input" value={newAddress.addressName} onChange={(e) => setNewAddress((a) => ({ ...a, addressName: e.target.value }))} />
                  </label>
                  <label className="h007-field">
                    <span className="h007-field__label">POSTAL CODE</span>
                    <input className="h007-field__input" value={newAddress.postalCode} onChange={(e) => setNewAddress((a) => ({ ...a, postalCode: e.target.value }))} />
                  </label>
                  <label className="h007-field">
                    <span className="h007-field__label">ADDRESS</span>
                    <input className="h007-field__input" value={newAddress.address} onChange={(e) => setNewAddress((a) => ({ ...a, address: e.target.value }))} />
                  </label>
                  <label className="h007-field">
                    <span className="h007-field__label">DETAIL ADDRESS</span>
                    <input className="h007-field__input" value={newAddress.detailAddress} onChange={(e) => setNewAddress((a) => ({ ...a, detailAddress: e.target.value }))} />
                  </label>
                  <button type="button" className="h007-primary-button" onClick={handleSaveAddress}>
                    SAVE ADDRESS
                  </button>
                </div>
              ) : (
                <button type="button" className="h007-text-link-button" style={{ marginTop: 16 }} onClick={() => setIsAddingAddress(true)}>
                  ADD NEW ADDRESS
                </button>
              )}
            </section>
          )}

          {activeTab === 'CLIENT FILE' && (
            <section>
              <h2 className="h007-section-title">CLIENT FILE</h2>
              {clientProfile === undefined && <p className="h007-modal-subtitle">Loading...</p>}
              {clientProfile === null && (
                <>
                  <p className="h007-modal-subtitle">You have not saved a Client File yet.</p>
                  <button type="button" className="h007-primary-button" style={{ width: 240 }} onClick={openClientFile}>
                    START YOUR PROFILE
                  </button>
                </>
              )}
              {clientProfile && (
                <div className="h007-client-file__tags">
                  {[clientProfile.mission, clientProfile.presence, clientProfile.style, clientProfile.fit, clientProfile.color]
                    .filter(Boolean)
                    .map((tag) => (
                      <span key={tag} className="h007-client-file__tag">
                        {tag.toUpperCase()}
                      </span>
                    ))}
                </div>
              )}
              {clientProfile?.recommended_product_id && (
                <Link to={`/product/${clientProfile.recommended_product_id}`} className="h007-text-link-button" style={{ marginTop: 16, display: 'inline-block' }}>
                  VIEW RECOMMENDED SUIT
                </Link>
              )}
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

export default MyHousePage;
