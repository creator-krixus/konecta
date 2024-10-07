import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import './ProductCard.scss';
import ConfirmationModal from '../Modals/Modal';
import NotificationModal from '../Modals/ModalConfirmation';
import EditProductModal from '../Modals/EditProductModal';
import { AuthContext } from '../../context/AuthContext';

const ProductCard = ({ product }) => {
  const { authState, deleteProduct, editProduct } = useContext(AuthContext);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [productToDelete, setProductToDelete] = useState(null);
  const role = authState.role || localStorage.getItem('role');

  const openConfirmationModal = (product) => {
    setProductToDelete(product);
    setConfirmationModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      const success = await deleteProduct(productToDelete._id);
      setConfirmationModalOpen(false);
      setNotificationModalOpen(true);
      setNotificationMessage(success ? 'Producto eliminado con éxito.' : 'El producto no se pudo eliminar');
    }
  };

  const handleCancelDelete = () => {
    setConfirmationModalOpen(false);
    setProductToDelete(null);
  };

  const handleNotificationClose = () => {
    setNotificationModalOpen(false);
  };

  const openEditModal = () => {
    setEditModalOpen(true);
  };

  const handleEditProductSave = async (updatedProduct) => {
    await editProduct(product._id, updatedProduct);
    setEditModalOpen(false);
    setNotificationModalOpen(true);
    setNotificationMessage('Producto editado con éxito.');
    window.location.reload();
  };

  const handleEditModalCancel = () => {
    setEditModalOpen(false);
  };

  return (
    <div className="card">
      <img src={product.imagen} alt={product.nombre} className="card__image" />
      <div className='card__info'>
        <h3 className="card__data">{product.nombre}</h3>
        <p className="card__data"><strong>Valor:</strong> ${product.valor}</p>
        <p className="card__data"><strong>Calificación:</strong> {product.calificacion}</p>
        {role === 'administrador' && (
          <div className='card__btns'>
            <div className='card__actions' onClick={openEditModal}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: 'rgba(0, 0, 0, 1)' }}>
                <path d="m16 2.012 3 3L16.713 7.3l-3-3zM4 14v3h3l8.299-8.287-3-3zm0 6h16v2H4z"></path>
              </svg>
            </div>
            <div className='card__actions' onClick={() => openConfirmationModal(product)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: 'rgba(0, 0, 0, 1)' }}>
                <path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm10.618-3L15 2H9L7.382 4H3v2h18V4z"></path>
              </svg>
            </div>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        message={`¿Estás seguro que deseas eliminar el producto ${productToDelete?.nombre}?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <NotificationModal
        isOpen={isNotificationModalOpen}
        message={notificationMessage}
        duration={10000}
        onClose={handleNotificationClose}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        product={product}
        onSave={handleEditProductSave}
        onCancel={handleEditModalCancel}
      />
    </div>
  );
};

export default ProductCard;

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};



