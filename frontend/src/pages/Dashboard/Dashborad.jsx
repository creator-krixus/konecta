import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import NavBar from '../../components/NavBar/NavBar';
import ProductCard from '../../components/Cards/ProductCard';
import './Dashboard.scss';

export default function Dashboard() {
  const { authState, getProducts } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    getProducts(page, limit);
  }, [page, limit]);

  const handleNextPage = () => {
    if (page < authState.totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="dashboard">
      <NavBar />
      <h2 className="dashboard__title">Lista de productos</h2>
      {authState.products && authState.products.length > 0 ? (
        <>
          <div className="dashboard__list">
            {authState.products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div className="dashboard__pagination">
            <button
              className='dashboard__prev'
              onClick={handlePrevPage}
              disabled={page === 1}
            >
              Anterior
            </button>
            <span>Página {page} de {authState.totalPages}</span>
            <button
              className='dashboard__next'
              onClick={handleNextPage}
              disabled={page === authState.totalPages}
            >
              Siguiente
            </button>
          </div>
        </>
      ) : (
        <p>No se encontraron productos.</p>
      )}
    </div>
  );
}





