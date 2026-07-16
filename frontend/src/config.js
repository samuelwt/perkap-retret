// TODO: after deploying Code.gs (see google-apps-script/SETUP.md), paste
// the Web App URL here. Everything the app does — reading items, moving
// them, checking them in — goes through this one URL.
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxVzsBxDxfhjasbfHBzyY3Q9qT8Xbrd16PWEUDigv8ZEglD6S-SS14-W70gEYmo0gDBaQ/exec';

// TODO: this is the OAuth "Client ID" you'll get from Google Cloud Console
// when setting up Google Sign-In in Phase 4 (admin login). Left as a
// placeholder for now since login wiring comes later.
export const GOOGLE_CLIENT_ID = 'PLACEHOLDER_GOOGLE_OAUTH_CLIENT_ID';

// How "stale" (unchecked) an item needs to be before it's flagged red
// in the stale-items panel. Tweak freely.
export const STALE_HOURS_WARNING = 6;
export const STALE_HOURS_CRITICAL = 24;
