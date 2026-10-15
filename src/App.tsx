import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { ProgressRail } from '@/components/layout/ProgressRail';
import { Footer } from '@/components/layout/Footer';
import { Home } from '@/pages/Home';
import { Thanks } from '@/pages/Thanks';
import { Privacy } from '@/pages/Privacy';
import { NotFound } from '@/pages/NotFound';
import { captureAttribution } from '@/lib/attribution';
import { initScrollDepth } from '@/lib/analytics';
import { useActiveSection } from '@/hooks/useActiveSection';
import { SCREENS } from '@/content/content';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname !== '/') window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const SCREEN_IDS = SCREENS.map((screen) => screen.id);

export default function App() {
  const { pathname } = useLocation();
  const active = useActiveSection(SCREEN_IDS);

  useEffect(() => {
    captureAttribution();
    return initScrollDepth();
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Перейти к содержимому
      </a>
      <ScrollToTop />
      <Header active={pathname === '/' ? active : undefined} />
      {pathname === '/' ? <ProgressRail active={active} /> : null}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/thanks" element={<Thanks />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
