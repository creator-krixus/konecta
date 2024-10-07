import PropTypes from 'prop-types';
import './Modal.scss';

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal__content">
        <p>{message}</p>
        <div className="modal__actions">
          <button className="modal__btn modal__btn--confirm" onClick={onConfirm}>Confirmar</button>
          <button className="modal__btn modal__btn--cancel" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmationModal;
