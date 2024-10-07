import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CreateUser.scss';
import { createUser, updateUser, deleteUser, fetchUsers } from '../../context/UserService';

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
  const [searchTerm, setSearchTerm] = useState('');

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
      const { success, message } = await updateUser(userId, formData);
      setMessage(message);
      if (success) {
        fetchUsersData();
        resetForm();
      }
    } else {
      const { success, message } = await createUser(formData);
      setMessage(message);
      if (success) {
        fetchUsersData();
        resetForm();
      }
    }
  };

  const fetchUsersData = async () => {
    const { success, users, message } = await fetchUsers();
    if (success) {
      setUsers(users);
    } else {
      setMessage(message);
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

  const handleDelete = async (id) => {
    const confirmation = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
    if (confirmation) {
      const { success, message } = await deleteUser(id);
      setMessage(message);
      if (success) {
        fetchUsersData();
      }
    }
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
    fetchUsersData();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='createUsers'>
      <Link to="/dashboard" className='createUsers__back'>
        <p>Regresar</p>
      </Link>
      <h2 className='createUsers__title'>{editMode ? 'Editar Usuario' : 'Crear Usuario'}</h2>
      <form onSubmit={handleSubmit} className='createUsers__form'>
        <div>
          <input
            className='createUsers__input'
            placeholder='Nombre'
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            className='createUsers__input'
            placeholder='Email'
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            className='createUsers__input'
            placeholder='Contraseña'
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!editMode}
          />
        </div>
        <div>
          <input
            className='createUsers__input'
            placeholder='Confirmar Contraseña'
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required={!editMode}
          />
        </div>
        <div>
          <select name="role" value={formData.role} onChange={handleChange} className='createUsers__selected'>
            <option value="administrador">Administrador</option>
            <option value="empleado">Empleado</option>
          </select>
        </div>
        <button className='createUsers__send' type="submit">{editMode ? 'Actualizar Usuario' : 'Crear Usuario'}</button>
        {editMode && <button className='createUsers__cancel' onClick={resetForm}>Cancelar</button>}
      </form>

      <h3>Lista de Usuarios</h3>
      <input
        className='createUsers__input'
        type="text"
        placeholder="Buscar por nombre o email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className='createUsers__tableWrapper'>
        {filteredUsers.length > 0 ? (
          <table className='createUsers__table'>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.nombre}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className='createUsers__btn' onClick={() => handleEdit(user)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: 'rgba(52, 47, 47)' }}>
                        <path d="m16 2.012 3 3L16.713 7.3l-3-3zM4 14v3h3l8.299-8.287-3-3zm0 6h16v2H4z"></path>
                      </svg>
                    </button>
                    <button className='createUsers__btn' onClick={() => handleDelete(user._id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: 'rgba(52, 47, 47)' }}>
                        <path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm10.618-3L15 2H9L7.382 4H3v2h18V4z"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay usuarios disponibles</p>
        )}
      </div>
    </div>
  );
};

export default CreateUser;
