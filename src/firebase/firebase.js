import { deleteApp, getApp, getApps, initializeApp } from "firebase/app"
import { getAuth, signOut, deleteUser as deleteAuthUser, reauthenticateWithCredential } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const REQUIRED_FIREBASE_ENV_KEYS = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
]

function getFirebaseConfig() {
  const missingKeys = REQUIRED_FIREBASE_ENV_KEYS.filter((key) => !import.meta.env[key])

  if (missingKeys.length > 0) {
    throw new Error(`Missing Firebase env vars: ${missingKeys.join(", ")}`)
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }
}

const firebaseConfig = getFirebaseConfig()

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

export async function runWithSecondaryAuth(callback) {
  const secondaryApp = initializeApp(firebaseConfig, `teamsync-secondary-${Date.now()}`)
  const secondaryAuth = getAuth(secondaryApp)

  try {
    return await callback(secondaryAuth)
  } finally {
    try {
      await signOut(secondaryAuth)
    } catch {
      // Ignore cleanup errors.
    }

    try {
      await deleteApp(secondaryApp)
    } catch {
      // Ignore cleanup errors.
    }
  }
}
