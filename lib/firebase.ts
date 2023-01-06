import { initializeApp, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCCynK4vZA1eSiGhqM2nS9Qgu8X-tj6J14",
  authDomain: "next-firebase-blogx.firebaseapp.com",
  projectId: "next-firebase-blogx",
  storageBucket: "next-firebase-blogx.appspot.com",
  messagingSenderId: "73077294176",
  appId: "1:73077294176:web:589302778c37a8ada36f05",
};

function createFirebaseApp(config: any) {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
}

const firebaseApp = createFirebaseApp(firebaseConfig);

// Auth
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

// Firestore (DB)
export const firestore = getFirestore(firebaseApp);

// Firebase Storage
export const storage = getStorage(firebaseApp);
export const STATE_CHANGED = "state_changed";

/********************* Helper functions **********************/
/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function docToJSON(doc: any) {
  const data = doc.data({ serverTimestamps: "estimate" });
  return {
    ...data,
    // Example of a Gotcha: firestore timestamp NOT serializable to JSON. Must convert to milliseconds. References to other documents are also not serializable.
    // createdAt: data?.createdAt.toMillis() || 0,
    // updatedAt: data?.updatedAt.toMillis() || 0,
  };
}
