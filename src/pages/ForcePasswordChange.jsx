import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input, Btn, Card } from "../components/ui"
import { useSessionUser } from "../hooks/useSessionUser"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"
import { reauthenticateWithCredential, updatePassword, EmailAuthProvider, signOut } from "firebase/auth"
import { auth } from "../firebase/firebase"

export default function ForcePasswordChange() {
  const { user: currentUser } = useSessionUser()
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!currentUser || !currentUser.mustChangePassword) {
    navigate(currentUser?.role === "admin" ? "/admin/dashboard" : "/dashboard", { replace: true })
    return null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")

    if (!newPassword || !confirmPassword || !currentPassword) {
      setError("Please fill in all fields")
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword)
      await reauthenticateWithCredential(auth.currentUser, credential)
      await updatePassword(auth.currentUser, newPassword)

      await updateDoc(doc(db, "users", currentUser.id), {
        mustChangePassword: false,
      })

      navigate(currentUser?.role === "admin" ? "/admin/dashboard" : "/dashboard", { replace: true })
    } catch (err) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setError("Current password is incorrect")
      } else if (err.code === "auth/requires-recent-login") {
        setError("Please log out and log back in, then try again")
        setTimeout(async () => {
          await signOut(auth)
          navigate("/login", { replace: true })
        }, 2000)
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-6 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-3xl border border-line/70 bg-[linear-gradient(180deg,rgba(63,54,45,0.96),rgba(44,38,31,0.96))] text-2xl shadow-soft">
            ◈
          </div>
          <h1 className="font-display text-2xl font-bold tracking-[-0.02em] text-copy">Set your password</h1>
          <p className="mt-1.5 text-sm text-muted">Create a secure password for your account</p>
        </div>

        <Card>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <p className="rounded-2xl border border-line/70 bg-white/[0.03] px-4 py-3 text-sm text-muted">
              This is your first time signing in. Please create a new password to continue.
            </p>

            <Input
              label="Current password"
              type="password"
              placeholder="Enter temporary password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              label="New password"
              type="password"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Confirm new password"
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-orange-200">Passwords do not match</p>
            )}

            {error && <p className="text-xs text-orange-200">{error}</p>}

            <div className="mt-1">
              <Btn className="w-full" type="submit" disabled={loading}>
                {loading ? "Setting password..." : "Set password"}
              </Btn>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}