import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../../src/pages/Home/Home';

describe('Home Component', () => {
  it('should render the home title and description', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Bienvenido a la página principal/i)).toBeInTheDocument();
  });

  it('should render a link to the login page', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const linkElement = screen.getByRole('link', { name: /Ingresar a la app/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/login');
  });
});


