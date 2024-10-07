import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createProduct, getProducts, deleteProduct, editProduct } from './ProductService';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    error: null,
    role: null,
    products: [],
  });

  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL_USERS}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.user.token);
        localStorage.setItem('role', data.user.role);
        setAuthState({ token: data.user.token, role: data.user.role, error: null });
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        setAuthState({ ...authState, error: errorData.message || 'Error de autenticación' });
      }
    } catch (error) {
      console.log(error);
      setAuthState({ ...authState, error: 'Error de conexión con el servidor' });
    }
  };

  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setAuthState({ token: null, role: null, error: null });
    navigate('/')
  }

  return (
    <AuthContext.Provider value={{
      authState, login, logOut,
      getProducts: (page, limit) => getProducts(authState, setAuthState, page, limit),
      deleteProduct: (id) => deleteProduct(id, authState, setAuthState),
      createProduct: (productData, imageFile) => createProduct(productData, imageFile, authState, setAuthState),
      editProduct: (productId, updatedProductData) => editProduct(productId, updatedProductData, authState, setAuthState),
    }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
