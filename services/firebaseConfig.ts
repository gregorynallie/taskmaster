// services/firebaseConfig.ts
// Firebase config. API key must come from env (set in .env.local) — never commit keys.
// Other values can stay here or be moved to env; apiKey is required from env for security.
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
  authDomain: "gen-lang-client-0475668328.firebaseapp.com",
  projectId: "gen-lang-client-0475668328",
  storageBucket: "gen-lang-client-0475668328.firebasestorage.app",
  messagingSenderId: "456346961737",
  appId: "1:456346961737:web:e866ada87b535ad862bc98",
  measurementId: "G-8SS7FXJBPD"
};