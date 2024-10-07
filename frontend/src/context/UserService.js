export const createUser = async (formData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL_USERS}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Usuario creado exitosamente');
      return { success: true, message: 'Usuario creado exitosamente' };
    } else {
      alert(data.message || 'Error al crear usuario');
      return { success: false, message: data.message || 'Error al crear usuario' };
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión');
    return { success: false, message: 'Error de conexión' };
  }
};

export const updateUser = async (id, formData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL_USERS}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Usuario actualizado exitosamente');
      return { success: true, message: 'Usuario actualizado exitosamente' };
    } else {
      alert(data.message || 'Error al actualizar usuario');
      return { success: false, message: data.message || 'Error al actualizar usuario' };
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión');
    return { success: false, message: 'Error de conexión' };
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL_USERS}/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Usuario eliminado exitosamente');
      return { success: true, message: 'Usuario eliminado exitosamente' };
    } else {
      alert('Error al eliminar usuario');
      return { success: false, message: 'Error al eliminar usuario' };
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión');
    return { success: false, message: 'Error de conexión' };
  }
};

export const fetchUsers = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL_USERS}`);
    const data = await response.json();

    if (response.ok) {
      return { success: true, users: data.users };
    } else {
      alert('Error al cargar los usuarios');
      return { success: false, message: 'Error al cargar los usuarios' };
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión al obtener usuarios');
    return { success: false, message: 'Error de conexión al obtener usuarios' };
  }
};
