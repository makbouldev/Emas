import { BrowserRouter, HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SiteDataContext } from './context/SiteDataContext';
import { useSiteContent } from './hooks/useSiteContent';
import SiteShell from './components/SiteShell';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import FleetPage from './pages/FleetPage';
import GalleryPage from './pages/GalleryPage';
import AdminBlogPage from './pages/AdminBlogPage';
import ContactPage from './pages/ContactPage';
import IndustrialMedicalizationPage from './pages/IndustrialMedicalizationPage';
import MedicalCounterVisitPage from './pages/MedicalCounterVisitPage';
import './App.css';

function App() {
  const siteData = useSiteContent();
  const Router = window.location.hostname.endsWith('github.io') ? HashRouter : BrowserRouter;

  return (
    <SiteDataContext.Provider value={siteData}>
      <Router>
        <Routes>
          <Route element={<SiteShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services-entreprises/nettoyage-sites-professionnels" element={<IndustrialMedicalizationPage />} />
            <Route path="/services-entreprises/audit-hygiene" element={<MedicalCounterVisitPage />} />
            <Route path="/services-entreprises/medicalisation-sites-industriels" element={<Navigate to="/services-entreprises/nettoyage-sites-professionnels" replace />} />
            <Route path="/services-entreprises/contre-visite-medicale" element={<Navigate to="/services-entreprises/audit-hygiene" replace />} />
            <Route path="/fleet" element={<FleetPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/admin" element={<AdminBlogPage />} />
            <Route path="/admin/blog" element={<Navigate to="/admin" replace />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </SiteDataContext.Provider>
  );
}

export default App;
