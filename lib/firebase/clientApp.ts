import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

export interface TenantFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface TenantFirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
}

/**
 * Returns (or initializes) the Firebase app for a given tenant config.
 *
 * On the browser there is exactly one tenant per page load, so we initialize
 * the [DEFAULT] app on first call and return it on every subsequent call,
 * even if the same function is invoked again (e.g. React StrictMode double
 * invocations). We deliberately avoid named apps here because Firebase Auth's
 * redirect-based social login and persistence layer require the [DEFAULT] app.
 *
 * On the server (SSR / RSC) this function is not called — the Admin SDK is
 * used instead. Server Components receive tenant config as props and pass it
 * to this provider via serialized JSON, never executing Firebase client SDK
 * calls themselves.
 */
export function getOrInitTenantApp(config: TenantFirebaseConfig): TenantFirebaseServices {
  // If the default app already exists, return its services immediately.
  // This handles React StrictMode double-invocations and fast navigations.
  const existing = getApps().find((a) => a.name === "[DEFAULT]");
  const app = existing ?? initializeApp(config);

  return {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app),
  };
}
