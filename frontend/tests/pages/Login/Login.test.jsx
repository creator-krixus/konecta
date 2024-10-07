import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest'; // O 'jest' si usas Jest
import { AuthContext } from '../../../src/context/AuthContext';
import Login from '../../../src/pages/Login/Login';

describe('Login Component', () => {
  const mockLogin = vi.fn(); // Mock de la función `login`
  const authState = { error: null }; // Simulación del estado de autenticación

  const renderComponent = () => {
    render(
      <AuthContext.Provider value={{ authState, login: mockLogin }}>
        <Login />
      </AuthContext.Provider>
    );
  };

  it('should render the login form correctly', () => {
    renderComponent();
    expect(screen.getByText(/Login/i, { selector: 'h2' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contaseña/i)).toBeInTheDocument();
    const submitButton = screen.getByRole('button', { name: /login/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('should update email and password fields on input', () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/contaseña/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });

  it('should call login function on form submission', () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/contaseña/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should display an error message when authState.error exists', () => {
    const errorMessage = 'Invalid credentials';
    render(
      <AuthContext.Provider value={{ authState: { error: errorMessage }, login: mockLogin }}>
        <Login />
      </AuthContext.Provider>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toHaveStyle('color: rgb(255, 0, 0)');
  });
});
