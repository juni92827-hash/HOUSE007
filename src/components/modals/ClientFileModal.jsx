import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalOverlay from '../common/ModalOverlay.jsx';
import { useClientFileStore } from '../../stores/clientFileStore';
import { useProductsStore } from '../../stores/productsStore';
import { useAuthStore } from '../../stores/authStore';
import { useUiStore } from '../../stores/uiStore';
import { useCartStore } from '../../stores/cartStore';
import { CLIENT_FILE_STEPS } from '../../data/clientFileSteps';
import { getRecommendation, getMissionProfileLabel } from '../../data/recommendation';
import { formatPrice } from '../../utils/format';
import '../common/forms.css';
import './client-file-modal.css';

function ClientFileModal() {
  const isOpen = useClientFileStore((s) => s.isOpen);
  const isCloseConfirmOpen = useClientFileStore((s) => s.isCloseConfirmOpen);
  const step = useClientFileStore((s) => s.step);
  const answers = useClientFileStore((s) => s.answers);
  const isAnalyzing = useClientFileStore((s) => s.isAnalyzing);
  const isComplete = useClientFileStore((s) => s.isComplete);
  const totalSteps = useClientFileStore((s) => s.totalSteps);

  const requestClose = useClientFileStore((s) => s.requestClose);
  const confirmClose = useClientFileStore((s) => s.confirmClose);
  const cancelClose = useClientFileStore((s) => s.cancelClose);
  const selectAnswer = useClientFileStore((s) => s.selectAnswer);
  const nextStep = useClientFileStore((s) => s.nextStep);
  const previousStep = useClientFileStore((s) => s.previousStep);
  const restartProfile = useClientFileStore((s) => s.restartProfile);
  const saveClientProfile = useClientFileStore((s) => s.saveClientProfile);

  const products = useProductsStore((s) => s.products);
  const user = useAuthStore((s) => s.user);
  const openLogin = useUiStore((s) => s.openLogin);
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();

  const [saveStatus, setSaveStatus] = useState('idle');

  const recommendedProduct = useMemo(() => {
    if (!isComplete) return null;
    return getRecommendation(products, answers);
  }, [isComplete, products, answers]);

  if (!isOpen) return null;

  if (isCloseConfirmOpen) {
    return (
      <ModalOverlay onClose={cancelClose}>
        <h2 className="h007-modal-title" style={{ textAlign: 'center' }}>
          CLOSE CLIENT FILE?
        </h2>
        <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
          <button type="button" className="h007-primary-button" onClick={cancelClose}>
            CONTINUE
          </button>
          <button type="button" className="h007-primary-button" onClick={confirmClose}>
            CLOSE
          </button>
        </div>
      </ModalOverlay>
    );
  }

  if (isAnalyzing) {
    return (
      <ModalOverlay onClose={() => {}}>
        <div className="h007-client-file__analyzing">
          <h2 className="h007-modal-title">ANALYZING YOUR PROFILE</h2>
          <p className="h007-modal-subtitle">Reviewing your purpose...</p>
          <p className="h007-modal-subtitle">Refining your style...</p>
          <p className="h007-modal-subtitle">Matching your profile...</p>
        </div>
      </ModalOverlay>
    );
  }

  if (isComplete && recommendedProduct) {
    const handleSave = async () => {
      if (!user) {
        openLogin();
        return;
      }
      setSaveStatus('saving');
      await saveClientProfile(user.id, recommendedProduct.id);
      setSaveStatus('saved');
    };

    const handleAddToBag = () => {
      const firstInStock = recommendedProduct.sizes?.find((s) => s.stock > 0);
      if (!firstInStock) return;
      addItem({
        productId: recommendedProduct.id,
        name: recommendedProduct.name,
        price: recommendedProduct.price,
        size: firstInStock.size,
        qty: 1,
        maxStock: firstInStock.stock,
      });
    };

    return (
      <ModalOverlay onClose={confirmClose}>
        <button type="button" className="h007-modal-close" onClick={confirmClose}>
          CLOSE
        </button>
        <p className="h007-client-file__eyebrow">MISSION PROFILE</p>
        <h2 className="h007-modal-title">{getMissionProfileLabel(answers)}</h2>

        <div className="h007-client-file__tags">
          {[answers.mission, answers.presence, answers.style, answers.fit, answers.color]
            .filter(Boolean)
            .map((tag) => (
              <span key={tag} className="h007-client-file__tag">
                {tag.toUpperCase()}
              </span>
            ))}
        </div>

        <div className="h007-client-file__recommendation">
          <span className="h007-client-file__recommendation-label">RECOMMENDED PRODUCT</span>
          <span className="h007-client-file__recommendation-name">{recommendedProduct.name}</span>
          <span className="h007-client-file__recommendation-price">{formatPrice(recommendedProduct.price)}</span>
        </div>

        <div className="h007-client-file__actions">
          <button
            type="button"
            className="h007-primary-button"
            onClick={() => {
              confirmClose();
              navigate(`/product/${recommendedProduct.id}`);
            }}
          >
            VIEW SUIT
          </button>
          <button type="button" className="h007-primary-button" onClick={handleAddToBag}>
            ADD TO BAG
          </button>
          <button type="button" className="h007-primary-button" onClick={handleSave} disabled={saveStatus === 'saving'}>
            {saveStatus === 'saved' ? 'SAVED TO MY HOUSE' : user ? 'SAVE TO MY HOUSE' : 'LOGIN TO SAVE'}
          </button>
          <button type="button" className="h007-text-link-button" onClick={restartProfile}>
            RESTART PROFILE
          </button>
        </div>
      </ModalOverlay>
    );
  }

  const currentStep = CLIENT_FILE_STEPS[step - 1];
  const currentAnswer = answers[currentStep.key];

  return (
    <ModalOverlay onClose={requestClose}>
      <button type="button" className="h007-modal-close" onClick={requestClose}>
        CLOSE
      </button>
      <p className="h007-client-file__progress">
        {String(step).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
      </p>
      <p className="h007-client-file__eyebrow">STEP {String(step).padStart(2, '0')} — {currentStep.label}</p>
      <h2 className="h007-modal-title">{currentStep.question}</h2>

      <div className="h007-client-file__options">
        {currentStep.options.map((option) => (
          <button
            type="button"
            key={option.value}
            className={`h007-client-file__option ${currentAnswer === option.value ? 'h007-client-file__option--selected' : ''}`}
            onClick={() => selectAnswer(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="h007-client-file__nav">
        {step > 1 && (
          <button type="button" className="h007-text-link-button" onClick={previousStep}>
            PREVIOUS
          </button>
        )}
        <button type="button" className="h007-primary-button" onClick={nextStep} disabled={!currentAnswer}>
          {step === totalSteps ? 'GENERATE PROFILE' : 'NEXT'}
        </button>
      </div>
    </ModalOverlay>
  );
}

export default ClientFileModal;
