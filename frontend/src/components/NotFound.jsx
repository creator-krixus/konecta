import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div>
      <h1>404 - Página no encontrada</h1>
      <p>Serás redirigido al home en 2 segundos...</p>
    </div>
  );
};

export default NotFound;
