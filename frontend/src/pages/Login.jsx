import { useEffect, useRef } from 'react';
import { GOOGLE_CLIENT_ID } from '../config.js';

/**
 * Real Google Sign-In, via Google Identity Services (the <script> tag
 * in index.html). How it works, step by step:
 *
 * 1. window.google.accounts.id.initialize() registers our GOOGLE_CLIENT_ID
 *    and a callback function for when sign-in succeeds.
 * 2. renderButton() draws Google's own official button into our <div>
 *    ref — we don't design this button ourselves, which is intentional:
 *    a recognizable Google button is more trustworthy to click than a
 *    custom-styled one, and Google requires using their button for the
 *    standard flow anyway.
 * 3. When you click it and sign in, Google calls our callback with a
 *    `credential` — a signed JWT proving who you are. We hand that
 *    straight to onSignIn(), which Admin.jsx stores and sends along
 *    with every write request. Code.gs independently re-verifies this
 *    token with Google's servers before trusting it (see isAdmin() in
 *    Code.gs) — so this page is UX, not the actual security boundary.
 */
export default function Login({ onSignIn }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!window.google || !buttonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => onSignIn(response.credential),
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'filled_black',
      size: 'large',
      shape: 'pill',
    });
  }, [onSignIn]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center">
      <h1 className="text-xl font-semibold">Inventory Master Sign-In</h1>
      <p className="text-sm text-slate-500 max-w-xs">
        Sign in with the Google account set as ADMIN_EMAIL in Code.gs.
        Any other account will be rejected when you try to make changes.
      </p>
      <div ref={buttonRef} />
    </div>
  );
}
