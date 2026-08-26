import { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import './auth-message-toast.css';

const MESSAGES = {
  signed_up: (name) => [`WELCOME TO THE HOUSE, MR. ${name}.`, 'Your journey begins here.'],
  signed_in: (name) => [`WELCOME BACK, MR. ${name}.`, 'Your House is ready.'],
  signed_out: (name) => [`UNTIL NEXT TIME, MR. ${name}.`, 'The House will be waiting.'],
};

/**
 * AuthMessageToast — shows the exact copy specified for signup/login/logout,
 * dynamically generated from the account's last name.
 */
function AuthMessageToast() {
  const lastEvent = useAuthStore((s) => s.lastEvent);
  const profile = useAuthStore((s) => s.profile);
  const lastKnownLastName = useAuthStore((s) => s.lastKnownLastName);
  const clearLastEvent = useAuthStore((s) => s.clearLastEvent);

  useEffect(() => {
    if (!lastEvent) return undefined;
    const timer = setTimeout(clearLastEvent, 4200);
    return () => clearTimeout(timer);
  }, [lastEvent, clearLastEvent]);

  if (!lastEvent) return null;

  const name = (profile?.last_name || lastKnownLastName || 'CLIENT').toUpperCase();
  const [title, subtitle] = MESSAGES[lastEvent](name);

  return (
    <div className="h007-auth-toast">
      <span className="h007-auth-toast__title">{title}</span>
      <span className="h007-auth-toast__subtitle">{subtitle}</span>
    </div>
  );
}

export default AuthMessageToast;
