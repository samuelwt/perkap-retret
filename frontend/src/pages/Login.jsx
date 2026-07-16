/**
 * STUB — full Google Sign-In wiring happens in Phase 4.
 *
 * The real version renders Google's official sign-in button (via the
 * Google Identity Services script), receives a signed idToken when you
 * log in, and passes it up to Admin.jsx. That token then gets sent
 * with every write request so Code.gs can verify it's really you
 * (see isAdmin() in Code.gs).
 *
 * For now this is a placeholder so routing and layout can be tested
 * before OAuth is wired up.
 */
export default function Login({ onSignIn }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center">
      <h1 className="text-xl font-semibold">Inventory Master Sign-In</h1>
      <p className="text-sm text-slate-500 max-w-xs">
        Google Sign-In will go here in Phase 4. For now, this button
        simulates signing in for local testing only.
      </p>
      <button
        onClick={() => onSignIn('DEV_PLACEHOLDER_TOKEN')}
        className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm"
      >
        (Dev only) Simulate sign-in
      </button>
    </div>
  );
}
