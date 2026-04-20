import { useCollection } from "./useCollection"

export function useTasks() {
  const collection = useCollection("tasks")
  return { ...collection, tasks: collection.documents }
}
