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
import { computeOrderStatus, getOrderStatusLabel, ORDER_STATUS_FLOW } from '../utils/orderStatus';
import { formatPrice } from '../utils/format';
import '../components/common/forms.css';
import '../components/modals/client-file-modal.css';
import './checkout-page.css';
import './my-house-page.css';

const TABS = [
  { key: 'MY ORDERS', label: '주문 내역' },
  { key: 'WISHLIST', label: '위시리스트' },
  { key: 'ADDRESS BOOK', label: '주소록' },
  { key: 'CLIENT FILE', label: '클라이언트 파일' },
];
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
        <p className="h007-modal-title h007-font-kr">마이페이지는 House 클라이언트를 위한 공간입니다</p>
        <p className="h007-modal-subtitle h007-font-kr">주문 내역, 위시리스트, 클라이언트 파일을 보려면 로그인해 주세요.</p>
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
                key={tab.key}
                className={`h007-nav-text h007-my-house__nav-item h007-font-kr ${activeTab === tab.key ? 'h007-my-house__nav-item--active' : ''}`}
                onClick={() => {
                  setActiveTab(tab.key);
                  setTrackingOrderId(null);
                }}
              >
                {tab.label}
              </button>
            ))}
            <button type="button" className="h007-nav-text h007-my-house__nav-item h007-font-kr" onClick={openLogoutConfirm}>
              로그아웃
            </button>
          </nav>
        </aside>

        <div className="h007-my-house__content">
          {activeTab === 'MY ORDERS' && (
            <section>
              <h2 className="h007-section-title h007-font-kr">주문 내역</h2>
              {orders.length === 0 && <p className="h007-modal-subtitle h007-font-kr">아직 주문 내역이 없습니다.</p>}

              {trackedOrder ? (
                <div className="h007-my-house__tracking">
                  <button type="button" className="h007-text-link-button h007-font-kr" onClick={() => setTrackingOrderId(null)}>
                    ← 주문 목록으로
                  </button>
                  <p className="h007-modal-subtitle h007-font-kr" style={{ marginTop: 16 }}>
                    주문 {trackedOrder.order_number}
                  </p>
                  <div className="h007-my-house__status-flow">
                    {ORDER_STATUS_FLOW.map((status) => {
                      const currentStatus = computeOrderStatus(trackedOrder.created_at);
                      const reached =
                        ORDER_STATUS_FLOW.indexOf(status) <= ORDER_STATUS_FLOW.indexOf(currentStatus);
                      return (
                        <span
                          key={status}
                          className={`h007-my-house__status-step h007-font-kr ${reached ? 'h007-my-house__status-step--reached' : ''}`}
                        >
                          {getOrderStatusLabel(status)}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="h007-my-house__orders">
                  {orders.map((order) => (
                    <div key={order.id} className="h007-my-house__order">
                      <div className="h007-my-house__order-header h007-font-kr">
                        <span>주문 {order.order_number}</span>
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                        <span>{getOrderStatusLabel(computeOrderStatus(order.created_at))}</span>
                      </div>
                      {order.items.map((item) => (
                        <div key={item.id} className="h007-checkout__item h007-font-kr">
                          <span>
                            {item.product_name} — 사이즈 {item.size} × {item.qty}
                          </span>
                          <span>{formatPrice(item.unit_price * item.qty)}</span>
                        </div>
                      ))}
                      <div className="h007-my-house__order-footer h007-font-kr">
                        <span>합계 {formatPrice(order.total)}</span>
                        <button
                          type="button"
                          className="h007-text-link-button h007-font-kr"
                          onClick={() => setTrackingOrderId(order.id)}
                        >
                          배송 조회
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
              <h2 className="h007-section-title h007-font-kr">위시리스트</h2>
              {wishlistProducts.length === 0 && <p className="h007-modal-subtitle h007-font-kr">위시리스트가 비어 있습니다.</p>}
              <div className="h007-my-house__wishlist">
                {wishlistProducts.map((product) => (
                  <div key={product.id} className="h007-my-house__wishlist-item">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                    <span>{formatPrice(product.price)}</span>
                    <button type="button" className="h007-text-link-button h007-font-kr" onClick={() => toggleWishlist(product.id)}>
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'ADDRESS BOOK' && (
            <section>
              <h2 className="h007-section-title h007-font-kr">주소록</h2>
              <div className="h007-my-house__addresses">
                {addresses.map((address) => (
                  <div key={address.id} className="h007-my-house__address">
                    <span>
                      {address.address_name} — {address.address} {address.detail_address}
                    </span>
                    <button type="button" className="h007-text-link-button h007-font-kr" onClick={() => removeAddress(address.id)}>
                      삭제
                    </button>
                  </div>
                ))}
              </div>

              {isAddingAddress ? (
                <div className="h007-checkout__new-address" style={{ marginTop: 24 }}>
                  <label className="h007-field">
                    <span className="h007-field__label h007-font-kr">주소 이름</span>
                    <input className="h007-field__input" value={newAddress.addressName} onChange={(e) => setNewAddress((a) => ({ ...a, addressName: e.target.value }))} />
                  </label>
                  <label className="h007-field">
                    <span className="h007-field__label h007-font-kr">우편번호</span>
                    <input className="h007-field__input" value={newAddress.postalCode} onChange={(e) => setNewAddress((a) => ({ ...a, postalCode: e.target.value }))} />
                  </label>
                  <label className="h007-field">
                    <span className="h007-field__label h007-font-kr">주소</span>
                    <input className="h007-field__input" value={newAddress.address} onChange={(e) => setNewAddress((a) => ({ ...a, address: e.target.value }))} />
                  </label>
                  <label className="h007-field">
                    <span className="h007-field__label h007-font-kr">상세주소</span>
                    <input className="h007-field__input" value={newAddress.detailAddress} onChange={(e) => setNewAddress((a) => ({ ...a, detailAddress: e.target.value }))} />
                  </label>
                  <button type="button" className="h007-primary-button h007-font-kr" onClick={handleSaveAddress}>
                    주소 저장
                  </button>
                </div>
              ) : (
                <button type="button" className="h007-text-link-button h007-font-kr" style={{ marginTop: 16 }} onClick={() => setIsAddingAddress(true)}>
                  새 주소 추가
                </button>
              )}
            </section>
          )}

          {activeTab === 'CLIENT FILE' && (
            <section>
              <h2 className="h007-section-title h007-font-kr">클라이언트 파일</h2>
              {clientProfile === undefined && <p className="h007-modal-subtitle h007-font-kr">불러오는 중...</p>}
              {clientProfile === null && (
                <>
                  <p className="h007-modal-subtitle h007-font-kr">아직 저장된 클라이언트 파일이 없습니다.</p>
                  <button type="button" className="h007-primary-button h007-font-kr" style={{ width: 240 }} onClick={openClientFile}>
                    프로필 시작하기
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
                <Link to={`/product/${clientProfile.recommended_product_id}`} className="h007-text-link-button h007-font-kr" style={{ marginTop: 16, display: 'inline-block' }}>
                  추천 슈트 보기
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
