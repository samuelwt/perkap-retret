import { Routes, Route, Link } from 'react-router-dom';
import MainPage from './pages/MainPage.jsx';
import ViewOnly from './pages/ViewOnly.jsx';
import Admin from './pages/Admin.jsx';

/**
 * This is the whole app's routing table:
 *  - "/"        -> MainPage: the landing menu (Tabular View / Location
 *                  View), no login needed.
 *  - "/tabular" -> ViewOnly: the checklist anyone with the link can see,
 *                  reached via the "Tabular View" button on MainPage.
 *  - "/admin"   -> Admin: gated behind your Google sign-in (wired in
 *                  Phase 4). This is where moving/removing/checking
 *                  items actually happens.
 *
 * Splitting them into separate routes (rather than one page with a
 * toggle) means you can bookmark/share the checklist link on its own,
 * and it keeps admin controls from ever being visible-but-disabled
 * clutter on everyone else's screen.
 */
export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/tabular" element={<ViewOnly />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3 px-6 text-center">
      <h1 className="text-xl font-semibold">Page not found</h1>
      <Link to="/" className="text-blue-600 underline">Back to home</Link>
    </div>
  );
}
