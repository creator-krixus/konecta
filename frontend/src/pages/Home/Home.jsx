import { Link } from 'react-router-dom';
import './Home.scss'

export default function Home() {
  return (
    <div className='home'>
      <h1 className='home__title'>Home</h1>
      <p className='home__description'>Bienvenido a la página principal</p>
      <Link className='home__login' to="login">Ingresar a la app</Link>
    </div>
  )
}
