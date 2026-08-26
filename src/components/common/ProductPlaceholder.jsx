import './product-placeholder.css';

/**
 * ProductPlaceholder
 *
 * Neutral stand-in for product/hero photography that has not been shot yet.
 * Keeps the exact layout dimensions specified for the real asset so swapping
 * in a final image or video later requires no layout changes.
 *
 * @param {string} name - product name shown as the placeholder label [Required]
 * @param {string} view - image view label, e.g. 'FRONT VIEW' [Optional]
 * @param {string} className - extra class for aspect-ratio/sizing from the parent [Optional]
 */
function ProductPlaceholder({ name, view, className = '' }) {
  return (
    <div className={`h007-placeholder ${className}`}>
      <span className="h007-placeholder__name">{name}</span>
      {view && <span className="h007-placeholder__view">{view}</span>}
    </div>
  );
}

export default ProductPlaceholder;
