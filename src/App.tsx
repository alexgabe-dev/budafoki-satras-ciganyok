import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import ProgramPage from './pages/ProgramPage';
import TicketsPage from './pages/TicketsPage';
import LocationPage from './pages/LocationPage';
import GalleryPage from './pages/GalleryPage';
import PackingListPage from './pages/PackingListPage';
import RulesPage from './pages/RulesPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import PrivacyPage from './pages/PrivacyPage';
import AdminPage from './pages/AdminPage';

// UX Helper: Scrolls window to top automatically when path changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant' as ScrollBehavior, // instant is standard, but casted just in case of ts variations
    });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppLayout />
    </Router>
  );
}

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-cream font-sans text-darkbrown antialiased selection:bg-orange selection:text-cream">
      {!isAdmin && <Header />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/program" element={<ProgramPage />} />
          <Route path="/jegyek" element={<TicketsPage />} />
          <Route path="/helyszin" element={<LocationPage />} />
          <Route path="/galeria" element={<GalleryPage />} />
          <Route path="/pakolo-lista" element={<PackingListPage />} />
          <Route path="/hazirend" element={<RulesPage />} />
          <Route path="/kapcsolat" element={<ContactPage />} />
          <Route path="/gyik" element={<FaqPage />} />
          <Route path="/adatvedelem" element={<PrivacyPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdmin && <Footer />}
    </div>
  );
}
