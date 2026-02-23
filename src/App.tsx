
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
import { HelmetProvider } from 'react-helmet-async';

// Mobile Imports
import { useIsMobile } from './hooks/useIsMobile';
import MobileLayout from './mobile/MobileLayout';
import MobileHome from './mobile/pages/MobileHome';
import MobileServices from './mobile/pages/MobileServices';
import MobilePortfolio from './mobile/pages/MobilePortfolio';
import MobileAbout from './mobile/pages/MobileAbout';

function AppContent() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MobileLayout>
        <Routes>
          <Route path="/" element={<MobileHome />} />
          <Route path="/services" element={<MobileServices />} />
          <Route path="/portfolio" element={<MobilePortfolio />} />
          <Route path="/about" element={<MobileAbout />} />
          
          {/* Shared Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<ClientDashboard />} />
          </Route>
          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route path="/crm" element={<AdminCRM />} />
          </Route>
        </Routes>
      </MobileLayout>
    );
  }

  return (
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
  );
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
      <AuthProvider>
        <UIProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </UIProvider>
      </AuthProvider>
    </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
