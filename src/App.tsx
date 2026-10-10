import { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useSmoothScroll, jumpToTop } from './lib/smoothScroll';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import ServiceDetail from './pages/ServiceDetail';
import CategoryPage from './pages/CategoryPage';
import ProjectDetail from './pages/ProjectDetail';
import Services from './components/Services';
import Work from './components/Work';
import Founders from './components/Founders';
import Pricing from './components/Pricing';
import Contact from './components/Contact';

/** Jump to the top on route change, unless the URL targets an in-page anchor. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    jumpToTop();
  }, [pathname, hash]);
  return null;
}

export default function App() {
  useSmoothScroll();
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-paper">
        <Nav />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/services"
              element={<CategoryPage title="Services"><Services /></CategoryPage>}
            />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route
              path="/work"
              element={<CategoryPage title="Work"><Work /></CategoryPage>}
            />
            <Route path="/work/:slug" element={<ProjectDetail />} />
            <Route
              path="/about"
              element={<CategoryPage title="About"><Founders /></CategoryPage>}
            />
            <Route
              path="/pricing"
              element={<CategoryPage title="Pricing"><Pricing /></CategoryPage>}
            />
            <Route
              path="/contact"
              element={<CategoryPage title="Contact"><Contact /></CategoryPage>}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
