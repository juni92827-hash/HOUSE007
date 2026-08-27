import { useState } from 'react';
import './product-placeholder.css';

/**
 * ProductPlaceholder
 *
 * Neutral stand-in for product/hero photography that has not been shot yet.
 * Keeps the exact layout dimensions specified for the real asset so swapping
 * in a final image or video later requires no layout changes. When `src` is
 * given, it renders the real photo instead and silently falls back to the
 * placeholder if that file does not exist yet (asset drop-in, no code change).
 *
 * @param {string} name - product name shown as the placeholder label [Required]
 * @param {string} view - image view label, e.g. 'FRONT VIEW' [Optional]
 * @param {string} src - expected local asset path for the real photo [Optional]
 * @param {string} alt - alt text used when `src` loads [Optional, 기본값: name]
 * @param {string} className - extra class for aspect-ratio/sizing from the parent [Optional]
 */
function ProductPlaceholder({ name, view, src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt ?? name}
        className={`h007-placeholder h007-placeholder--image ${className}`}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className={`h007-placeholder ${className}`}>
      <span className="h007-placeholder__name">{name}</span>
      {view && <span className="h007-placeholder__view">{view}</span>}
    </div>
  );
}

export default ProductPlaceholder;
