import { useState } from 'react';
import ModalOverlay from '../common/ModalOverlay.jsx';
import { useUiStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';
import '../common/forms.css';

function LoginModal() {
  const isOpen = useUiStore((s) => s.isLoginOpen);
  const closeLogin = useUiStore((s) => s.closeLogin);
  const openSignup = useUiStore((s) => s.openSignup);
  const signIn = useAuthStore((s) => s.signIn);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await signIn({ email, password });
    setIsSubmitting(false);
    if (result.ok) {
      setEmail('');
      setPassword('');
      closeLogin();
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return;
    await supabase.auth.resetPasswordForEmail(email);
    setResetSent(true);
  };

  return (
    <ModalOverlay onClose={closeLogin}>
      <button type="button" className="h007-modal-close" onClick={closeLogin}>
        CLOSE
      </button>
      <h2 className="h007-modal-title">WELCOME TO THE HOUSE</h2>
      <p className="h007-modal-subtitle">Sign in to continue your journey.</p>

      {error && <p className="h007-form-error">{error}</p>}
      {resetSent && <p className="h007-form-error" style={{ color: 'var(--h007-success)' }}>PASSWORD RESET LINK SENT</p>}

      <form onSubmit={handleSubmit}>
        <label className="h007-field">
          <span className="h007-field__label">EMAIL</span>
          <input
            type="email"
            className="h007-field__input"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError();
            }}
            required
          />
        </label>
        <label className="h007-field">
          <span className="h007-field__label">PASSWORD</span>
          <input
            type="password"
            className="h007-field__input"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearError();
            }}
            required
          />
        </label>

        <button type="button" className="h007-text-link-button" onClick={handleForgotPassword}>
          FORGOT PASSWORD?
        </button>

        <button type="submit" className="h007-primary-button" disabled={isSubmitting}>
          LOGIN
        </button>
      </form>

      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
        <button type="button" className="h007-text-link-button" onClick={openSignup}>
          JOIN THE HOUSE
        </button>
        <button type="button" className="h007-text-link-button" onClick={closeLogin}>
          CONTINUE AS GUEST
        </button>
      </div>
    </ModalOverlay>
  );
}

export default LoginModal;
