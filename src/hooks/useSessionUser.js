import { useState } from "react"
import { clearStoredUser, getHomeRoute, getStoredUser, setStoredUser } from "../lib/session"

export function useSessionUser() {
  const [user, setUserState] = useState(() => getStoredUser())

  const setUser = (nextUser) => {
    const persistedUser = setStoredUser(nextUser)
    setUserState(persistedUser)
    return persistedUser
  }

  const clearUser = () => {
    clearStoredUser()
    setUserState(null)
  }

  return {
    user,
    setUser,
    clearUser,
    isAuthenticated: Boolean(user),
    homeRoute: getHomeRoute(user),
  }
}
