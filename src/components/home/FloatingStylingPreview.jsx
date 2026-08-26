import './floating-styling-preview.css';

/**
 * FloatingStylingPreview
 *
 * @param {string} productName - shown as the preview heading [Required]
 * @param {string[]} stylingSet - accessory labels for this product [Required]
 * @param {{x:number, y:number}} position - viewport coordinates to follow the cursor [Required]
 * @param {boolean} isVisible - controls opacity/scale in/out [Required]
 */
function FloatingStylingPreview({ productName, stylingSet, position, isVisible }) {
  return (
    <div
      className={`h007-styling-preview ${isVisible ? 'h007-styling-preview--visible' : ''}`}
      style={{ left: position.x + 24, top: position.y + 24 }}
      aria-hidden="true"
    >
      <span className="h007-styling-preview__title">{productName}</span>
      <ul className="h007-styling-preview__list">
        {stylingSet.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default FloatingStylingPreview;
