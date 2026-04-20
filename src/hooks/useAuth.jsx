import { useState, useEffect } from "react"
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "../firebase/firebase"
import { formatDisplayDate, getRandomMemberColor } from "../lib/appData"
import { normalizeUser, setStoredUser, clearStoredUser } from "../lib/session"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
        if (userDoc.exists()) {
          setUser(normalizeUser({ uid: firebaseUser.uid, ...userDoc.data() }))
        } else {
          setUser(normalizeUser({ uid: firebaseUser.uid, email: firebaseUser.email }))
        }
      } else {
        setUser(null)
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
        userData = normalizeUser({ uid: result.user.uid, ...userDoc.data() })
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

  const register = async (name, email, password, role = "member") => {
    setError("")
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName: name })
      
      const userData = {
        name,
        email,
        role,
        color: getRandomMemberColor(),
        createdAt: formatDisplayDate()
      }
      
      await setDoc(doc(db, "users", result.user.uid), userData)
      const userWithUid = normalizeUser({ uid: result.user.uid, ...userData })
      setUser(userWithUid)
      setStoredUser(userWithUid)
      return userWithUid
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      clearStoredUser()
    } catch (err) {
      setError(err.message)
    }
  }

  return { user, loading, error, login, register, logout }
}
