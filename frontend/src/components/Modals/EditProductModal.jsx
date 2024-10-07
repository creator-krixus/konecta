import { useState } from 'react';
import PropTypes from 'prop-types';
import './EditProductModal.scss';

const EditProductModal = ({ isOpen, product, onSave, onCancel }) => {
  const [updatedProduct, setUpdatedProduct] = useState(product);
  const [imagePreview, setImagePreview] = useState(product.imagen);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct({ ...updatedProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const updatedData = { ...updatedProduct };
    if (selectedImage) {
      updatedData.imagen = selectedImage;
    }
    onSave(updatedData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal__content">
        <h2>Editar Producto</h2>

        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={updatedProduct.nombre}
            onChange={handleChange}
          />
        </label>

        <label>
          Valor:
          <input
            type="number"
            name="valor"
            value={updatedProduct.valor}
            onChange={handleChange}
          />
        </label>

        <label>
          Calificación:
          <input
            type="number"
            name="calificacion"
            value={updatedProduct.calificacion}
            onChange={handleChange}
          />
        </label>

        <label>
          Imagen:
          <input
            type="file"
            name="imagen"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Vista previa" className="image-preview__img" />
          </div>
        )}

        <div className="modal__actions">
          <button onClick={handleSubmit}>Guardar</button>
          <button onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

EditProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  product: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EditProductModal;


