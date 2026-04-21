const SESSION_KEY = "teamsync_user"
const MEMBER_ROLES = ["member", "PL", "viewer"]

export function normalizeUser(rawUser) {
  if (!rawUser) return null

  const id = rawUser.id ?? rawUser.uid ?? null

  return {
    ...rawUser,
    id,
    uid: rawUser.uid ?? id,
  }
}

export function hasValidRole(user) {
  if (!user?.role) return false
  return user.role === "admin" || MEMBER_ROLES.includes(user.role)
}

export function getStoredUser() {
  try {
    const stored = localStorage.getItem(SESSION_KEY)
    return stored ? normalizeUser(JSON.parse(stored)) : null
  } catch {
    return null
  }
}

export function setStoredUser(user) {
  const normalizedUser = normalizeUser(user)

  if (!normalizedUser) {
    localStorage.removeItem(SESSION_KEY)
    return null
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(normalizedUser))
  return normalizedUser
}

export function clearStoredUser() {
  localStorage.removeItem(SESSION_KEY)
}

export function getHomeRoute(user) {
  if (!hasValidRole(user)) return "/login"
  return user.role === "admin" ? "/admin/dashboard" : "/dashboard"
}
