import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useProductsStore } from './stores/productsStore';
import { useWishlistStore } from './stores/wishlistStore';
import Header from './components/layout/Header.jsx';
import LoginModal from './components/modals/LoginModal.jsx';
import SignupModal from './components/modals/SignupModal.jsx';
import LogoutConfirmModal from './components/modals/LogoutConfirmModal.jsx';
import SearchOverlay from './components/modals/SearchOverlay.jsx';
import BagPanel from './components/modals/BagPanel.jsx';
import ClientFileModal from './components/modals/ClientFileModal.jsx';
import GlobalAudio from './components/layout/GlobalAudio.jsx';
import AudioControls from './components/layout/AudioControls.jsx';
import AuthMessageToast from './components/layout/AuthMessageToast.jsx';
import LandingPage from './pages/LandingPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import MyHousePage from './pages/MyHousePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  const location = useLocation();
  const init = useAuthStore((state) => state.init);
  const user = useAuthStore((state) => state.user);
  const loadProducts = useProductsStore((state) => state.load);
  const syncWishlist = useWishlistStore((state) => state.syncWithAuth);

  useEffect(() => {
    init();
    loadProducts();
  }, [init, loadProducts]);

  useEffect(() => {
    syncWishlist(user);
  }, [user, syncWishlist]);

  const isLanding = location.pathname === '/';

  return (
    <>
      <GlobalAudio />
      <AudioControls />
      <AuthMessageToast />
      {!isLanding && <Header />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/my-house" element={<MyHousePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <LoginModal />
      <SignupModal />
      <LogoutConfirmModal />
      <SearchOverlay />
      <BagPanel />
      <ClientFileModal />
    </>
  );
}

export default App;
