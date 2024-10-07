import { useEffect } from 'react';
import PropTypes from 'prop-types';
import './ModalConfirmation.scss';

const NotificationModal = ({ isOpen, message, duration, onClose }) => {
  useEffect(() => {
    if (isOpen && duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div className="notification-modal">
      <div className="notification-modal__content">
        <p>{message}</p>
        <button className="notification-modal__close-btn" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

NotificationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

export default NotificationModal;
