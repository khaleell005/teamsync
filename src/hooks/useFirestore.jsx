import { useCollection } from "./useCollection"

export function useFirestore(collectionName) {
  return useCollection(collectionName)
}
