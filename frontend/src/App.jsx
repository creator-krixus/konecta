import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';
import Login from '../src/pages/Login/Login';
import Dashboard from '../src/pages/Dashboard/Dashborad';
import Home from '../src/pages/Home/Home';
import NotFound from '../src/components/NotFound';
import CreateUser from '../src/pages/Users/CreateUser';
import CreateProducts from './pages/Products/CreateProducts';
import ProtectedRoute from '../src/components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/create-products"
            element={
              <ProtectedRoute allowedRoles={['administrador', 'empleado']}>
                <CreateProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['administrador', 'empleado']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Ruta protegida solo para administradores */}
          <Route
            path="/create-user"
            element={
              <ProtectedRoute allowedRoles={['administrador']}>
                <CreateUser />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;


