import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Consultant from './pages/public/Consultant';

/**
 * Entry point for the standalone landing-page build deployed to GitHub Pages.
 *
 * Pages serves static files only — there is no Express API and no database — so
 * this bundle deliberately excludes the router, auth store, and every dashboard
 * route. It renders the consultant landing page and nothing else.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Consultant />
  </StrictMode>,
);
