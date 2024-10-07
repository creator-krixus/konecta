import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './CreateProducts.scss'

const CreateProduct = () => {
  const { createProduct } = useContext(AuthContext);
  const [productData, setProductData] = useState({
    imagen: '',
    nombre: '',
    valor: '',
    calificacion: ''
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createProduct(productData, imageFile);
      if (response.success) {
        alert('Producto creado exitosamente!');
        setProductData({
          imagen: '',
          nombre: '',
          valor: '',
          calificacion: ''
        });
        setImageFile(null);
        e.target.reset();
      } else {
        alert('Error creando el producto: ' + response.message);
      }
    } catch (error) {
      console.error('Error al crear el producto:', error);
      alert('Hubo un error creando el producto.');
    }
  };

  return (
    <>
      <div className='products'>
        <Link to="/dashboard" className='products__back'>
          <p>Regresar</p>
        </Link>
        <h2 className='products__title'>Crear Producto</h2>
        <form className='products__form' onSubmit={handleSubmit}>
          <div>
            <label className='products__label'>Nombre:</label>
            <input
              className='products__input'
              type="text"
              name="nombre"
              value={productData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className='products__label'>Valor:</label>
            <input
              className='products__input'
              type="number"
              name="valor"
              value={productData.valor}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className='products__label'>Calificación:</label>
            <input
              className='products__input'
              type="number"
              name="calificacion"
              value={productData.calificacion}
              onChange={handleChange}
              min="1"
              max="5"
              required
            />
          </div>
          <div>
            <label className='products__label'>Imagen:</label>
            <input className='products__input' type="file" onChange={handleImageChange} required />
          </div>
          <button className='products__send' type="submit">Crear Producto</button>
        </form>
      </div>
    </>
  );
};

export default CreateProduct;


