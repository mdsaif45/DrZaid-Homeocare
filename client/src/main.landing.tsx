import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './theme';
import './index.css';
import Consultant from './pages/public/Consultant';

/**
 * Entry point for the standalone landing-page build deployed to GitHub Pages.
 *
 * Pages serves static files only — there is no Express API and no database — so
 * this bundle deliberately excludes the router, auth store, and every dashboard
 * route. It renders the consultant landing page wrapped in ThemeProvider.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Consultant />
    </ThemeProvider>
  </StrictMode>,
);
