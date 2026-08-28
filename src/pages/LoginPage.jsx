import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../image/logo/1.png';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import '../components/common/forms.css';
import './auth-page.css';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const signIn = useAuthStore((s) => s.signIn);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await signIn({ email, password });
    setIsSubmitting(false);
    if (result.ok) {
      navigate(location.state?.from ?? '/home');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return;
    await supabase.auth.resetPasswordForEmail(email);
    setResetSent(true);
  };

  return (
    <main className="h007-auth-page">
      <div className="h007-auth-page__top">
        <Link to="/home" aria-label="HOUSE 007 — Home">
          <img src={logo} alt="HOUSE 007" className="h007-auth-page__logo" />
        </Link>
      </div>

      <div className="h007-auth-page__main">
        <div className="h007-auth-page__panel">
          <h1 className="h007-auth-page__title">ENTER THE HOUSE</h1>

          {error && <p className="h007-form-error h007-font-kr" style={{ textAlign: 'center' }}>{error}</p>}
          {resetSent && (
            <p className="h007-form-error h007-font-kr" style={{ textAlign: 'center', color: 'var(--h007-success)' }}>
              비밀번호 재설정 링크를 보냈습니다
            </p>
          )}

          <form className="h007-auth-page__form" onSubmit={handleSubmit}>
            <label className="h007-field">
              <span className="h007-field__label h007-font-kr">이메일</span>
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
              <span className="h007-field__label h007-font-kr">비밀번호</span>
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

            <button type="submit" className="h007-primary-button h007-font-kr" disabled={isSubmitting}>
              로그인
            </button>

            <div className="h007-auth-page__links">
              <button type="button" className="h007-text-link-button h007-font-kr" onClick={handleForgotPassword}>
                비밀번호를 잊으셨나요?
              </button>
            </div>
          </form>

          <div className="h007-auth-page__footer">
            <span className="h007-modal-subtitle" style={{ marginBottom: 0 }}>
              NEW TO THE HOUSE?
            </span>
            <Link to="/signup" className="h007-text-link-button h007-font-kr">
              회원가입
            </Link>
          </div>
        </div>
      </div>

      <div className="h007-auth-page__back" style={{ paddingBottom: 40 }}>
        <Link to="/home" className="h007-text-link-button">
          BACK TO HOUSE 007
        </Link>
      </div>
    </main>
  );
}

export default LoginPage;
