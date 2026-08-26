import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../image/logo/1.png';
import { useAuthStore } from '../../stores/authStore';
import { useUiStore } from '../../stores/uiStore';
import { useCartStore } from '../../stores/cartStore';
import { useClientFileStore } from '../../stores/clientFileStore';
import ShopDropdown from './ShopDropdown.jsx';
import './header.css';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isShopOpen, setShopOpen] = useState(false);
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const openLogin = useUiStore((s) => s.openLogin);
  const openSearch = useUiStore((s) => s.openSearch);
  const openMiniBag = useCartStore((s) => s.openMiniBag);
  const bagCount = useCartStore((s) => s.count());
  const openClientFile = useClientFileStore((s) => s.openClientFile);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const bagLabel = bagCount > 0 ? `BAG ${String(bagCount).padStart(2, '0')}` : 'BAG';

  return (
    <header className={`h007-header ${scrolled ? 'h007-header--scrolled' : ''}`}>
      <div className="h007-header__inner h007-content">
        <Link to="/home" className="h007-header__logo-link" aria-label="HOUSE 007 — Home">
          <img src={logo} alt="HOUSE 007" className="h007-header__logo" />
        </Link>

        <nav className="h007-header__nav">
          <div
            className="h007-header__nav-item"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <button
              type="button"
              className="h007-nav-text h007-header__link"
              onClick={() => navigate('/home#collection')}
            >
              SHOP
            </button>
            {isShopOpen && <ShopDropdown onNavigate={() => setShopOpen(false)} />}
          </div>

          <button type="button" className="h007-nav-text h007-header__link" onClick={openClientFile}>
            AI STYLE
          </button>

          <button type="button" className="h007-nav-text h007-header__link" onClick={openSearch}>
            SEARCH
          </button>

          {user ? (
            <button
              type="button"
              className="h007-nav-text h007-header__link"
              onClick={() => navigate('/my-house')}
            >
              {profile?.last_name ? `MR. ${profile.last_name.toUpperCase()}` : 'MY HOUSE'}
            </button>
          ) : (
            <button type="button" className="h007-nav-text h007-header__link" onClick={openLogin}>
              LOGIN
            </button>
          )}

          <button type="button" className="h007-nav-text h007-header__link" onClick={openMiniBag}>
            {bagLabel}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
