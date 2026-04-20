import { Navigate, Outlet } from "react-router-dom"
import { getHomeRoute, getStoredUser } from "../../lib/session"

export default function ProtectedRoute({ allowedRoles }) {
  const user = getStoredUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getHomeRoute(user)} replace />
  }

  return <Outlet />
}
