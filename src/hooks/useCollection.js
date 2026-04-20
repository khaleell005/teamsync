import { useEffect, useState } from "react"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore"
import { db } from "../firebase/firebase"
import { formatDisplayDate } from "../lib/appData"

function mapSnapshot(snapshot) {
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export function useCollection(collectionName) {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchAll = async () => {
    try {
      setLoading(true)
      setError("")

      const collectionQuery = query(
        collection(db, collectionName),
        orderBy("createdAtTimestamp", "desc"),
      )
      const snapshot = await getDocs(collectionQuery)
      const nextDocuments = mapSnapshot(snapshot)
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
      await fetchAll()
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
      await fetchAll()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const remove = async (id) => {
    try {
      setError("")
      const docRef = doc(db, collectionName, id)
      await deleteDoc(docRef)
      setDocuments((previousDocuments) => previousDocuments.filter((item) => item.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    let isActive = true

    async function loadDocuments() {
      try {
        setLoading(true)
        setError("")

        const collectionQuery = query(
          collection(db, collectionName),
          orderBy("createdAtTimestamp", "desc"),
        )
        const snapshot = await getDocs(collectionQuery)

        if (isActive) {
          setDocuments(mapSnapshot(snapshot))
        }
      } catch (err) {
        if (isActive) {
          setError(err.message)
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    void loadDocuments()

    return () => {
      isActive = false
    }
  }, [collectionName])

  return { documents, loading, error, fetchAll, fetchOne, add, update, remove }
}
