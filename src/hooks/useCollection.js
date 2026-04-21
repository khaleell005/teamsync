import { useEffect, useState } from "react"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore"
import { db } from "../firebase/firebase"
import { formatDisplayDate } from "../lib/appData"

function mapSnapshot(snapshot) {
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

function toSortValue(value) {
  if (!value) return 0

  if (typeof value.toMillis === "function") {
    return value.toMillis()
  }

  if (value instanceof Date) {
    return value.getTime()
  }

  if (typeof value === "number") {
    return value
  }

  if (typeof value === "string") {
    const parsed = Date.parse(value)
    return Number.isNaN(parsed) ? 0 : parsed
  }

  if (typeof value.seconds === "number") {
    return value.seconds * 1000
  }

  return 0
}

function sortDocuments(documents) {
  return [...documents].sort((a, b) => {
    const aValue = toSortValue(a.createdAtTimestamp ?? a.createdAt)
    const bValue = toSortValue(b.createdAtTimestamp ?? b.createdAt)
    return bValue - aValue
  })
}

export function useCollection(collectionName) {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchAll = async () => {
    try {
      setLoading(true)
      setError("")

      const collectionRef = collection(db, collectionName)
      const snapshot = await getDocs(collectionRef)
      const nextDocuments = sortDocuments(mapSnapshot(snapshot))
      setDocuments(nextDocuments)
      return nextDocuments
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }

  const fetchOne = async (id) => {
    try {
      setError("")
      const docRef = doc(db, collectionName, id)
      const snapshot = await getDoc(docRef)
      return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
    } catch (err) {
      setError(err.message)
      return null
    }
  }

  const add = async (data) => {
    try {
      setError("")
      const payload = {
        ...data,
        createdAt: data.createdAt ?? formatDisplayDate(),
        createdAtTimestamp: data.createdAtTimestamp ?? serverTimestamp(),
      }
      const docRef = await addDoc(collection(db, collectionName), payload)
      return docRef.id
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const update = async (id, data) => {
    try {
      setError("")
      const docRef = doc(db, collectionName, id)
      await updateDoc(docRef, data)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const remove = async (id) => {
    try {
      setError("")
      const docRef = doc(db, collectionName, id)
      await updateDoc(docRef, { removed: true, removedAt: serverTimestamp() })
      setDocuments((previousDocuments) => previousDocuments.filter((item) => item.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    setLoading(true)
    setError("")

    const collectionRef = collection(db, collectionName)
    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const docs = mapSnapshot(snapshot).filter(doc => !doc.removed)
        setDocuments(sortDocuments(docs))
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )

    return () => {
      unsubscribe()
    }
  }, [collectionName])

  return { documents, loading, error, fetchAll, fetchOne, add, update, remove }
}
