import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthContext } from '../../../src/context/AuthContext';
import Dashboard from '../../../src/pages/Dashboard/Dashborad';

vi.mock('../../../src/components/NavBar/NavBar', () => {
  return {
    __esModule: true,
    default: () => <div>NavBar Mock</div>,
  };
});

vi.mock('../../../src/components/Cards/ProductCard', () => {
  return {
    __esModule: true,
    default: ({ product }) => <div>{product.name}</div>,
  };
});

describe('Dashboard Component', () => {
  const mockGetProducts = vi.fn();
  const mockProducts = [
    { _id: '1', name: 'Producto 1' },
    { _id: '2', name: 'Producto 2' },
  ];
  const authState = {
    products: mockProducts,
    totalPages: 3,
  };

  const renderComponent = () => {
    render(
      <AuthContext.Provider value={{ authState, getProducts: mockGetProducts }}>
        <Dashboard />
      </AuthContext.Provider>
    );
  };

  it('should render the dashboard title and product list', () => {
    renderComponent();

    expect(screen.getByText(/Lista de productos/i)).toBeInTheDocument();

    mockProducts.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });

    expect(screen.getByText(/NavBar Mock/i)).toBeInTheDocument();
  });

  it('should call getProducts on component mount', () => {
    renderComponent();
    expect(mockGetProducts).toHaveBeenCalledWith(1, 10);
  });

  it('should handle pagination buttons correctly', () => {
    renderComponent();

    const nextPageButton = screen.getByText(/Siguiente/i);
    const prevPageButton = screen.getByText(/Anterior/i);

    expect(prevPageButton).toBeDisabled();
    expect(nextPageButton).toBeEnabled();
    fireEvent.click(nextPageButton);
    expect(mockGetProducts).toHaveBeenCalledWith(2, 10);
  });

  it('should display a message when no products are available', () => {
    const emptyAuthState = {
      ...authState,
      products: [],
    };

    render(
      <AuthContext.Provider value={{ authState: emptyAuthState, getProducts: mockGetProducts }}>
        <Dashboard />
      </AuthContext.Provider>
    );
    expect(screen.getByText(/No se encontraron productos/i)).toBeInTheDocument();
  });
});
