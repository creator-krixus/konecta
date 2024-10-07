import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebaseConfig';

export const createProduct = async (productData, imageFile, authState, setAuthState) => {
  try {
    const token = authState.token || localStorage.getItem('token');
    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    // Subir la imagen a Firebase
    const uploadImage = async (file) => {
      const storageRef = ref(storage, `products/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    };

    let imageUrl = '';
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    // Crear el producto
    const productDataToSend = {
      ...productData,
      imagen: imageUrl,
    };

    const response = await fetch(`${import.meta.env.VITE_API_URL_PRODUCTS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productDataToSend),
    });

    if (response.ok) {
      const newProduct = await response.json();
      setAuthState({ ...authState, products: [...authState.products, newProduct] });
      return { success: true, message: 'Producto creado exitosamente.' };
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el producto.');
    }
  } catch (error) {
    console.error('Error en createProduct:', error);
    return { success: false, message: error.message };
  }
};

export const getProducts = async (authState, setAuthState, page = 1, limit = 10) => {

  try {
    const token = authState.token || localStorage.getItem('token');
    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL_PRODUCTS}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setAuthState({
        ...authState,
        products: data.products,
        totalPages: data.totalPages,
        totalProducts: data.totalProducts,
        page
      });
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener los productos');
    }
  } catch (error) {
    console.error('Error en getProducts:', error);
    setAuthState({ ...authState, error: error.message });
  }
};

export const deleteProduct = async (id, authState, setAuthState) => {
  try {
    const token = authState.token || localStorage.getItem('token');
    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL_PRODUCTS}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      setTimeout(() => {
        const updatedProducts = authState.products.filter(product => product._id !== id);
        setAuthState({ ...authState, products: updatedProducts });
      }, 1000);
      return { success: true, message: 'Producto eliminado con éxito.' };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.message || 'Error al eliminar el producto' };
    }
  } catch (error) {
    console.error('Error en deleteProduct:', error);
    return { success: false, message: error.message };
  }
};

export const editProduct = async (productId, updatedProductData, authState, setAuthState) => {
  try {
    const token = authState.token || localStorage.getItem('token');
    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    // Subir la imagen a Firebase si se proporciona un nuevo archivo de imagen
    let imageUrl = updatedProductData.imagen;
    const uploadImage = async (file) => {

      const storageRef = ref(storage, `products/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    };


    if (typeof imageUrl !== 'string') {
      imageUrl = await uploadImage(imageUrl);
    }

    const productDataToSend = {
      ...updatedProductData,
      imagen: imageUrl,
    };

    const response = await fetch(`${import.meta.env.VITE_API_URL_PRODUCTS}/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productDataToSend),
    });

    if (response.ok) {
      const updatedProduct = await response.json();

      const updatedProducts = authState.products.map(product =>
        product._id === productId ? updatedProduct : product
      );
      // const updatedProducts = authState.products.filter(product => product._id !== id);

      setAuthState({ ...authState, products: updatedProducts });

      return { success: true, message: 'Producto actualizado exitosamente.' };
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar el producto.');
    }
  } catch (error) {
    console.error('Error en editProduct:', error);
    return { success: false, message: error.message };
  }
};

