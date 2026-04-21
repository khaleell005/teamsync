import 'dotenv/config'
import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getFirestore, setDoc, doc, serverTimestamp } from 'firebase/firestore'

const args = process.argv.slice(2)
const email = args[0] || 'admin@teamsync.io'
const password = args[1] || 'admin123'
const name = args[2] || 'Admin'

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

async function createAdmin() {
  const role = "admin"

  try {
    console.log("Creating admin account...")
    console.log("Email:", email)
    
    const result = await createUserWithEmailAndPassword(auth, email, password)
    console.log("Auth user created:", result.user.uid)
    
    await updateProfile(result.user, { displayName: name })
    
    const userData = {
      name,
      email,
      role,
      color: "#99977C",
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      createdAtTimestamp: serverTimestamp(),
    }
    
    await setDoc(doc(db, "users", result.user.uid), userData)
    console.log("User document created in Firestore")
    
    console.log("\n✅ Admin account created successfully!")
    console.log("Email:", email)
    console.log("Password:", password)
    console.log("Name:", name)
    
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      console.log("\n⚠️ Admin account already exists!")
      console.log("Email:", email)
    } else {
      console.error("\n❌ Error:", error.message)
    }
  }
}

createAdmin().then(() => process.exit())
