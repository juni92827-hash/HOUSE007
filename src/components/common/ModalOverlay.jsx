import './modal-overlay.css';

/**
 * ModalOverlay
 *
 * @param {function} onClose - called when the backdrop is clicked [Required]
 * @param {node} children - modal panel content [Required]
 * @param {string} align - 'center' | 'right', controls panel placement [Optional, 기본값: 'center']
 */
function ModalOverlay({ onClose, children, align = 'center' }) {
  return (
    <div className="h007-modal-overlay" onClick={onClose}>
      <div
        className={`h007-modal-overlay__panel h007-modal-overlay__panel--${align}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default ModalOverlay;
