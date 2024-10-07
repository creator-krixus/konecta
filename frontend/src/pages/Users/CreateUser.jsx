// import { useState, useEffect } from 'react';

// const CreateUser = () => {
//   // Estado para los datos del formulario
//   const [formData, setFormData] = useState({
//     nombre: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     role: 'administrador',
//   });

//   // Estado para manejar mensajes de éxito o error
//   const [message, setMessage] = useState(null);

//   // Estado para almacenar la lista de usuarios
//   const [users, setUsers] = useState([]);

//   // Función para manejar cambios en el formulario
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Función para manejar el envío del formulario
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validar que las contraseñas coincidan antes de enviar
//     if (formData.password !== formData.confirmPassword) {
//       setMessage('Las contraseñas no coinciden');
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:7000/api/v1/users/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage('Usuario creado exitosamente');
//         // Refrescar la lista de usuarios
//         fetchUsers();

//         // Limpiar el formulario
//         setFormData({
//           nombre: '',
//           email: '',
//           password: '',
//           confirmPassword: '',
//           role: 'administrador',
//         });
//       } else {
//         setMessage(data.message || 'Error al crear usuario');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setMessage('Error de conexión');
//     }
//   };

//   // Función para obtener los usuarios
//   const fetchUsers = async () => {
//     try {
//       const response = await fetch('http://localhost:7000/api/v1/users');
//       const data = await response.json();
//       if (response.ok) {
//         setUsers(data.users);
//       } else {
//         setMessage('Error al cargar los usuarios');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setMessage('Error de conexión al obtener usuarios');
//     }
//   };

//   // Obtener los usuarios cuando el componente se monta
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   return (
//     <div>
//       <h2>Crear Usuario</h2>
//       {message && <p>{message}</p>}
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Nombre:</label>
//           <input
//             type="text"
//             name="nombre"
//             value={formData.nombre}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label>Email:</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label>Contraseña:</label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label>Confirmar Contraseña:</label>
//           <input
//             type="password"
//             name="confirmPassword"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label>Rol:</label>
//           <select name="role" value={formData.role} onChange={handleChange}>
//             <option value="administrador">Administrador</option>
//             <option value="empleado">Empleado</option>
//           </select>
//         </div>
//         <button type="submit">Crear Usuario</button>
//       </form>

//       <h2>Lista de Usuarios</h2>
//       {users.length > 0 ? (
//         <table>
//           <thead>
//             <tr>
//               <th>Nombre</th>
//               <th>Email</th>
//               <th>Rol</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user._id}>
//                 <td>{user.nombre}</td>
//                 <td>{user.email}</td>
//                 <td>{user.role}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No hay usuarios disponibles</p>
//       )}
//     </div>
//   );
// };

// export default CreateUser;

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
  const [editMode, setEditMode] = useState(false); // Estado para modo edición
  const [userId, setUserId] = useState(null); // Estado para el id del usuario que se está editando

  // Función para manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Función para manejar el envío del formulario (crear o editar)
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

  // Función para crear un nuevo usuario
  const createUser = async () => {
    try {
      const response = await fetch('http://localhost:7000/api/v1/users/register', {
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

  // Función para actualizar un usuario
  const updateUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:7000/api/v1/users/${id}`, {
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

  // Función para eliminar un usuario
  const deleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:7000/api/v1/users/${id}`, {
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

  // Función para obtener los usuarios
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:7000/api/v1/users');
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

  // Función para establecer los datos del formulario para edición
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

  // Función para resetear el formulario
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

  // Obtener los usuarios cuando el componente se monta
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
            required={!editMode} // Si estamos en modo edición, la contraseña no es requerida
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

