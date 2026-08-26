import ModalOverlay from '../common/ModalOverlay.jsx';
import { useUiStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import '../common/forms.css';

function LogoutConfirmModal() {
  const isOpen = useUiStore((s) => s.isLogoutConfirmOpen);
  const closeLogoutConfirm = useUiStore((s) => s.closeLogoutConfirm);
  const signOut = useAuthStore((s) => s.signOut);

  if (!isOpen) return null;

  const handleLogout = async () => {
    await signOut();
    closeLogoutConfirm();
  };

  return (
    <ModalOverlay onClose={closeLogoutConfirm}>
      <h2 className="h007-modal-title" style={{ textAlign: 'center' }}>
        LEAVE THE HOUSE?
      </h2>
      <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
        <button type="button" className="h007-primary-button" onClick={closeLogoutConfirm}>
          STAY
        </button>
        <button type="button" className="h007-primary-button" onClick={handleLogout}>
          LOG OUT
        </button>
      </div>
    </ModalOverlay>
  );
}

export default LogoutConfirmModal;
