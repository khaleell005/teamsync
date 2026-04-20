import { useCollection } from "./useCollection"

export function useProjects() {
  const collection = useCollection("projects")
  return { ...collection, projects: collection.documents }
}
