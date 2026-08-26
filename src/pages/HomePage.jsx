import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/home/Hero.jsx';
import ProductCarousel from '../components/home/ProductCarousel.jsx';
import MasterSection from '../components/home/MasterSection.jsx';
import FabricSection from '../components/home/FabricSection.jsx';
import { useProductsStore } from '../stores/productsStore';
import './home-page.css';

function HomePage() {
  const location = useLocation();
  const products = useProductsStore((s) => s.products);
  const status = useProductsStore((s) => s.status);

  useEffect(() => {
    if (location.hash === '#collection') {
      document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash]);

  return (
    <main className="h007-home">
      <Hero />

      <section id="collection" className="h007-collection">
        <div className="h007-content h007-collection__header">
          <h2 className="h007-section-title">THE HOUSE COLLECTION</h2>
          <p className="h007-section-subcopy">Curated suits for every occasion.</p>
        </div>
        {status === 'loaded' && products.length > 0 && <ProductCarousel products={products} />}
      </section>

      <MasterSection />
      <FabricSection />
    </main>
  );
}

export default HomePage;
