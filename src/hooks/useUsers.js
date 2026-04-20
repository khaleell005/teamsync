import { useCollection } from "./useCollection"

export function useUsers() {
  const collection = useCollection("users")
  return { ...collection, users: collection.documents }
}
