import { useState, useEffect } from "react"
import { 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "../firebase/firebase"
import { normalizeUser, setStoredUser, clearStoredUser } from "../lib/session"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
          const nextUser = userDoc.exists()
            ? normalizeUser({ uid: firebaseUser.uid, ...userDoc.data() })
            : normalizeUser({ uid: firebaseUser.uid, email: firebaseUser.email })

          setUser(nextUser)
          setStoredUser(nextUser)
        } catch (err) {
          setError(err.message)
          const fallbackUser = normalizeUser({ uid: firebaseUser.uid, email: firebaseUser.email })
          setUser(fallbackUser)
          setStoredUser(fallbackUser)
        }
      } else {
        setUser(null)
        clearStoredUser()
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = async (email, password) => {
    setError("")
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const userDoc = await getDoc(doc(db, "users", result.user.uid))
      let userData
      if (userDoc.exists()) {
        const data = userDoc.data()
        if (data.removed) {
          await signOut(auth)
          throw new Error("Account has been removed")
        }
        userData = normalizeUser({ uid: result.user.uid, ...data })
      } else {
        userData = normalizeUser({ uid: result.user.uid, email: result.user.email })
      }
      setUser(userData)
      setStoredUser(userData)
      return userData
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    setError("")
    try {
      await signOut(auth)
      setUser(null)
      clearStoredUser()
      return true
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const resetPassword = async (email) => {
    setError("")
    try {
      await sendPasswordResetEmail(auth, email)
      return true
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return { user, loading, error, login, logout, resetPassword }
}
