import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../image/logo/1.png';
import { useAuthStore } from '../stores/authStore';
import '../components/common/forms.css';
import './auth-page.css';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  postalCode: '',
  address: '',
  detailAddress: '',
  addressName: '',
  deliveryRequest: '',
  dateOfBirth: '',
  gender: '',
  termsAccepted: false,
  privacyAccepted: false,
  marketingEmail: false,
  marketingSms: false,
};

function SignupPage() {
  const navigate = useNavigate();
  const signUp = useAuthStore((s) => s.signUp);

  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canSubmit =
    form.firstName &&
    form.lastName &&
    form.email &&
    form.password &&
    form.password === form.confirmPassword &&
    form.termsAccepted &&
    form.privacyAccepted;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (form.password !== form.confirmPassword) {
      setFormError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!form.termsAccepted || !form.privacyAccepted) {
      setFormError('이용약관과 개인정보처리방침에 동의해 주세요.');
      return;
    }

    setIsSubmitting(true);
    const result = await signUp({
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      marketingEmail: form.marketingEmail,
      marketingSms: form.marketingSms,
      address: {
        postalCode: form.postalCode,
        address: form.address,
        detailAddress: form.detailAddress,
        addressName: form.addressName,
        deliveryRequest: form.deliveryRequest,
      },
    });
    setIsSubmitting(false);

    if (result.ok) {
      navigate('/login');
    } else {
      setFormError(result.error || '문제가 발생했습니다.');
    }
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
          <h1 className="h007-auth-page__title">BECOME A MEMBER OF THE HOUSE</h1>

          {formError && <p className="h007-form-error h007-font-kr" style={{ textAlign: 'center' }}>{formError}</p>}

          <form className="h007-auth-page__form" onSubmit={handleSubmit}>
            <div className="h007-field-row">
              <label className="h007-field">
                <span className="h007-field__label h007-font-kr">이름</span>
                <input className="h007-field__input" value={form.firstName} onChange={update('firstName')} required />
              </label>
              <label className="h007-field">
                <span className="h007-field__label h007-font-kr">성</span>
                <input className="h007-field__input" value={form.lastName} onChange={update('lastName')} required />
              </label>
            </div>

            <div className="h007-field-row">
              <label className="h007-field">
                <span className="h007-field__label h007-font-kr">이메일</span>
                <input type="email" className="h007-field__input" value={form.email} onChange={update('email')} required />
              </label>
              <label className="h007-field">
                <span className="h007-field__label h007-font-kr">전화번호</span>
                <input className="h007-field__input" value={form.phone} onChange={update('phone')} />
              </label>
            </div>

            <div className="h007-field-row">
              <label className="h007-field">
                <span className="h007-field__label h007-font-kr">비밀번호</span>
                <input type="password" className="h007-field__input" value={form.password} onChange={update('password')} required />
              </label>
              <label className="h007-field">
                <span className="h007-field__label h007-font-kr">비밀번호 확인</span>
                <input type="password" className="h007-field__input" value={form.confirmPassword} onChange={update('confirmPassword')} required />
              </label>
            </div>

            <p className="h007-field__label h007-font-kr" style={{ marginBottom: 12 }}>배송지</p>

            <label className="h007-field">
              <span className="h007-field__label h007-font-kr">우편번호</span>
              <input className="h007-field__input" value={form.postalCode} onChange={update('postalCode')} />
            </label>
            <label className="h007-field">
              <span className="h007-field__label h007-font-kr">주소</span>
              <input className="h007-field__input" value={form.address} onChange={update('address')} />
            </label>
            <label className="h007-field">
              <span className="h007-field__label h007-font-kr">상세주소</span>
              <input className="h007-field__input" value={form.detailAddress} onChange={update('detailAddress')} />
            </label>
            <div className="h007-field-row">
              <label className="h007-field">
                <span className="h007-field__label h007-font-kr">주소 이름</span>
                <input className="h007-field__input" value={form.addressName} onChange={update('addressName')} placeholder="집" />
              </label>
              <label className="h007-field">
                <span className="h007-field__label h007-font-kr">배송 요청사항</span>
                <input className="h007-field__input" value={form.deliveryRequest} onChange={update('deliveryRequest')} />
              </label>
            </div>

            <div className="h007-field-row">
              <label className="h007-field">
                <span className="h007-field__label h007-font-kr">생년월일</span>
                <input type="date" className="h007-field__input" value={form.dateOfBirth} onChange={update('dateOfBirth')} />
              </label>
              <label className="h007-field">
                <span className="h007-field__label h007-font-kr">성별</span>
                <input className="h007-field__input" value={form.gender} onChange={update('gender')} />
              </label>
            </div>

            <label className="h007-checkbox-row h007-font-kr">
              <input type="checkbox" checked={form.termsAccepted} onChange={update('termsAccepted')} required />
              이용약관에 동의합니다
            </label>
            <label className="h007-checkbox-row h007-font-kr">
              <input type="checkbox" checked={form.privacyAccepted} onChange={update('privacyAccepted')} required />
              개인정보처리방침에 동의합니다
            </label>
            <label className="h007-checkbox-row h007-font-kr">
              <input type="checkbox" checked={form.marketingEmail} onChange={update('marketingEmail')} />
              마케팅 이메일 수신 (선택)
            </label>
            <label className="h007-checkbox-row h007-font-kr">
              <input type="checkbox" checked={form.marketingSms} onChange={update('marketingSms')} />
              마케팅 SMS 수신 (선택)
            </label>

            <button type="submit" className="h007-primary-button h007-font-kr" disabled={!canSubmit || isSubmitting}>
              회원가입
            </button>
          </form>

          <div className="h007-auth-page__footer">
            <span className="h007-modal-subtitle h007-font-kr" style={{ marginBottom: 0 }}>
              이미 계정이 있으신가요?
            </span>
            <Link to="/login" className="h007-text-link-button h007-font-kr">
              로그인
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

export default SignupPage;
