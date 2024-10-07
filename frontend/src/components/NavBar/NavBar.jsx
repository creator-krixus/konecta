import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Menu from '../../assets/bx-menu.svg'
import './NavBar.scss'


export default function NavBar() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };
  const { authState, logOut } = useContext(AuthContext);
  const role = authState.role || localStorage.getItem('role');
  return (
    <div className='navBar'>
      <div className='navBar__role'>{role}</div>
      <div className='navBar__menu' onClick={toggleMenu}>
        <img src={Menu}></img>
      </div>
      <div className={`navBar__options ${isMenuVisible ? 'show' : ''}`}>
        <div className="navBar__close"><span className='navBar__equis' onClick={toggleMenu}>x</span></div>
        <Link to="/create-products" className='navBar__item'>Crear productos</Link>
        {role === 'administrador' &&
          (<Link to="/create-user" className='navBar__item'>Usuarios</Link>)}
        <div onClick={logOut} className='navBar__item'>Salir</div>
      </div>
    </div>
  )
}
