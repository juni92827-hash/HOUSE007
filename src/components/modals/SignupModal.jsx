import { useState } from 'react';
import ModalOverlay from '../common/ModalOverlay.jsx';
import { useUiStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import '../common/forms.css';

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

function SignupModal() {
  const isOpen = useUiStore((s) => s.isSignupOpen);
  const closeSignup = useUiStore((s) => s.closeSignup);
  const openLogin = useUiStore((s) => s.openLogin);
  const signUp = useAuthStore((s) => s.signUp);

  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

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
      setFormError('Passwords do not match.');
      return;
    }
    if (!form.termsAccepted || !form.privacyAccepted) {
      setFormError('Please accept the Terms of Service and Privacy Policy.');
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
      setForm(initialForm);
      closeSignup();
    } else {
      setFormError(result.error || 'Something went wrong.');
    }
  };

  return (
    <ModalOverlay onClose={closeSignup}>
      <button type="button" className="h007-modal-close" onClick={closeSignup}>
        CLOSE
      </button>
      <h2 className="h007-modal-title">JOIN THE HOUSE</h2>
      <p className="h007-modal-subtitle">Create your client account.</p>

      {formError && <p className="h007-form-error">{formError}</p>}

      <form onSubmit={handleSubmit}>
        <div className="h007-field-row">
          <label className="h007-field">
            <span className="h007-field__label">FIRST NAME</span>
            <input className="h007-field__input" value={form.firstName} onChange={update('firstName')} required />
          </label>
          <label className="h007-field">
            <span className="h007-field__label">LAST NAME</span>
            <input className="h007-field__input" value={form.lastName} onChange={update('lastName')} required />
          </label>
        </div>

        <label className="h007-field">
          <span className="h007-field__label">EMAIL</span>
          <input type="email" className="h007-field__input" value={form.email} onChange={update('email')} required />
        </label>

        <div className="h007-field-row">
          <label className="h007-field">
            <span className="h007-field__label">PASSWORD</span>
            <input type="password" className="h007-field__input" value={form.password} onChange={update('password')} required />
          </label>
          <label className="h007-field">
            <span className="h007-field__label">CONFIRM PASSWORD</span>
            <input type="password" className="h007-field__input" value={form.confirmPassword} onChange={update('confirmPassword')} required />
          </label>
        </div>

        <label className="h007-field">
          <span className="h007-field__label">PHONE</span>
          <input className="h007-field__input" value={form.phone} onChange={update('phone')} />
        </label>

        <label className="h007-field">
          <span className="h007-field__label">POSTAL CODE</span>
          <input className="h007-field__input" value={form.postalCode} onChange={update('postalCode')} />
        </label>
        <label className="h007-field">
          <span className="h007-field__label">ADDRESS</span>
          <input className="h007-field__input" value={form.address} onChange={update('address')} />
        </label>
        <label className="h007-field">
          <span className="h007-field__label">DETAIL ADDRESS</span>
          <input className="h007-field__input" value={form.detailAddress} onChange={update('detailAddress')} />
        </label>
        <div className="h007-field-row">
          <label className="h007-field">
            <span className="h007-field__label">ADDRESS NAME</span>
            <input className="h007-field__input" value={form.addressName} onChange={update('addressName')} placeholder="Home" />
          </label>
          <label className="h007-field">
            <span className="h007-field__label">DELIVERY REQUEST</span>
            <input className="h007-field__input" value={form.deliveryRequest} onChange={update('deliveryRequest')} />
          </label>
        </div>

        <div className="h007-field-row">
          <label className="h007-field">
            <span className="h007-field__label">DATE OF BIRTH</span>
            <input type="date" className="h007-field__input" value={form.dateOfBirth} onChange={update('dateOfBirth')} />
          </label>
          <label className="h007-field">
            <span className="h007-field__label">GENDER</span>
            <input className="h007-field__input" value={form.gender} onChange={update('gender')} />
          </label>
        </div>

        <label className="h007-checkbox-row">
          <input type="checkbox" checked={form.termsAccepted} onChange={update('termsAccepted')} required />
          I agree to the Terms of Service
        </label>
        <label className="h007-checkbox-row">
          <input type="checkbox" checked={form.privacyAccepted} onChange={update('privacyAccepted')} required />
          I agree to the Privacy Policy
        </label>
        <label className="h007-checkbox-row">
          <input type="checkbox" checked={form.marketingEmail} onChange={update('marketingEmail')} />
          Marketing emails (optional)
        </label>
        <label className="h007-checkbox-row">
          <input type="checkbox" checked={form.marketingSms} onChange={update('marketingSms')} />
          Marketing SMS (optional)
        </label>

        <button type="submit" className="h007-primary-button" disabled={!canSubmit || isSubmitting}>
          CREATE ACCOUNT
        </button>
      </form>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <button type="button" className="h007-text-link-button" onClick={openLogin}>
          Already a client? LOGIN
        </button>
      </div>
    </ModalOverlay>
  );
}

export default SignupModal;
