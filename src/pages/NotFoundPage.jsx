import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <main style={{ padding: '220px 40px', textAlign: 'center' }}>
      <h1 className="h007-section-title">404</h1>
      <p className="h007-section-subcopy" style={{ marginTop: 16 }}>
        This page does not exist within the House.
      </p>
      <Link to="/home" className="h007-nav-text" style={{ display: 'inline-block', marginTop: 32, color: 'var(--h007-cream)' }}>
        RETURN HOME
      </Link>
    </main>
  );
}

export default NotFoundPage;
