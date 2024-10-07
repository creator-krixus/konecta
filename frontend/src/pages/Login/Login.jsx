import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './Login.scss'

const Login = () => {
  const { authState, login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className='login'>
      <h2 className='login__title'>Login</h2>
      <form onSubmit={handleSubmit} className='login__form'>
        {authState.error && <p style={{ color: 'red' }}>{authState.error}</p>}
        <div className='login__container'>
          <input
            className='login__input'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            required
          />
        </div>
        <div className='login__container'>
          <input
            className='login__input'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='contaseña'
            required
          />
        </div>
        <button className='login__btn' type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;


