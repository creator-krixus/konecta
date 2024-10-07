import { useState, useEffect } from 'react';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'administrador',
  });

  const [message, setMessage] = useState(null);
  const [users, setUsers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    if (editMode) {
      await updateUser(userId);
    } else {
      await createUser();
    }
  };

  const createUser = async () => {
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
        setMessage('Usuario creado exitosamente');
        fetchUsers();
        resetForm();
      } else {
        setMessage(data.message || 'Error al crear usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error de conexión');
    }
  };

  const updateUser = async (id) => {
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
        setMessage('Usuario actualizado exitosamente');
        fetchUsers();
        resetForm();
        setEditMode(false);
        setUserId(null);
      } else {
        setMessage(data.message || 'Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error de conexión');
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL_USERS}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Usuario eliminado exitosamente');
        fetchUsers();
      } else {
        setMessage('Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error de conexión');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL_USERS}`);
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
      } else {
        setMessage('Error al cargar los usuarios');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error de conexión al obtener usuarios');
    }
  };

  const handleEdit = (user) => {
    setFormData({
      nombre: user.nombre,
      email: user.email,
      password: '',
      confirmPassword: '',
      role: user.role,
    });
    setUserId(user._id);
    setEditMode(true);
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'administrador',
    });
    setEditMode(false);
    setUserId(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>{editMode ? 'Editar Usuario' : 'Crear Usuario'}</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!editMode}
          />
        </div>
        <div>
          <label>Confirmar Contraseña:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required={!editMode}
          />
        </div>
        <div>
          <label>Rol:</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="administrador">Administrador</option>
            <option value="empleado">Empleado</option>
          </select>
        </div>
        <button type="submit">{editMode ? 'Actualizar Usuario' : 'Crear Usuario'}</button>
        {editMode && <button onClick={resetForm}>Cancelar</button>}
      </form>

      <h2>Lista de Usuarios</h2>
      {users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.nombre}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Editar</button>
                  <button onClick={() => deleteUser(user._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay usuarios disponibles</p>
      )}
    </div>
  );
};

export default CreateUser;

