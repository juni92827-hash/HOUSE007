import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useProductsStore } from './stores/productsStore';
import { useWishlistStore } from './stores/wishlistStore';
import Header from './components/layout/Header.jsx';
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
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
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
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      <GlobalAudio />
      <AudioControls />
      <AuthMessageToast />
      {!isLanding && !isAuthPage && <Header />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/my-house" element={<MyHousePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <LogoutConfirmModal />
      <SearchOverlay />
      <BagPanel />
      <ClientFileModal />
    </>
  );
}

export default App;
