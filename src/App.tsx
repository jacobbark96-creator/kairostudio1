import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ServicesPage from './components/ServicesPage';
import PortfolioPage from './components/PortfolioPage';
import AboutPage from './components/AboutPage';
import LoginPage from './pages/LoginPage';
import ClientDashboard from './pages/ClientDashboard';
import AdminCRM from './pages/AdminCRM';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './hooks/useTheme';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UIProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<ClientDashboard />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute requireAdmin={true} />}>
                  <Route path="/crm" element={<AdminCRM />} />
                </Route>
              </Routes>
            </Layout>
          </BrowserRouter>
        </UIProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
