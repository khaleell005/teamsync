import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import Layout from "../components/layout/Layout"
import { Card, Avatar, Badge, Btn, Input, PageHeader } from "../components/ui"
import { useUsers } from "../hooks/useUsers"
import { useSessionUser } from "../hooks/useSessionUser"
import { auth } from "../firebase/firebase"
import { reauthenticateWithCredential, updatePassword, EmailAuthProvider, signOut } from "firebase/auth"
import { clearStoredUser } from "../lib/session"

export default function Profile() {
  const { user: currentUser, setUser: setSessionUser } = useSessionUser()
  const { update: updateUser } = useUsers()
  const navigate = useNavigate()
  const [editMode, setEditMode] = useState(false)
  const [passwordMode, setPasswordMode] = useState(false)
  const [form, setForm] = useState({
    name: currentUser?.name ?? "",
    photo: currentUser?.photo ?? null,
    phone: currentUser?.phone ?? "",
    address: currentUser?.address ?? "",
    dob: currentUser?.dob ?? "",
  })
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  const handleSave = async () => {
    const updated = { ...currentUser, ...form }
    setSessionUser(updated)
    await updateUser(currentUser.id, form)
    setEditMode(false)
  }

  const handlePasswordChange = async (event) => {
    event.preventDefault()
    setError("")

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setError("Please fill in all fields")
      return
    }

    if (passwords.new.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (passwords.new !== passwords.confirm) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const credential = EmailAuthProvider.credential(currentUser.email, passwords.current)
      await reauthenticateWithCredential(auth.currentUser, credential)
      await updatePassword(auth.currentUser, passwords.new)

      setPasswordMode(false)
      setPasswords({ current: "", new: "", confirm: "" })
      setError("")
    } catch (err) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setError("Current password is incorrect")
      } else if (err.code === "auth/requires-recent-login") {
        setError("Please log out and log back in, then try again")
        setTimeout(async () => {
          await signOut(auth)
          clearStoredUser()
          navigate("/login")
        }, 2000)
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout role={currentUser.role} user={currentUser}>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <PageHeader
          title="Profile"
          subtitle="Manage your account settings"
        />

        <Card>
          <h3 className="mb-5 text-sm font-semibold text-copy">Your Profile</h3>

          <div className="mb-6 flex items-center gap-5">
            {form.photo ? (
              <img src={form.photo} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <Avatar name={form.name} color={currentUser.color} photo={form.photo} size={80} />
            )}

            <div>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-accent">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files[0]
                    if (!file) return

                    const reader = new FileReader()
                    reader.onloadend = () => setForm({ ...form, photo: reader.result })
                    reader.readAsDataURL(file)
                  }}
                />
                {form.photo ? "Change photo" : "Add photo"}
              </label>

              {form.photo && (
                <button
                  onClick={() => setForm({ ...form, photo: null })}
                  className="mt-1.5 block text-[11px] text-muted transition hover:text-copy"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="mb-5 grid gap-4 sm:grid-cols-2">
            <Input
              label="Display name"
              value={form.name}
              placeholder="Your name"
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
            <Input label="Email" value={currentUser.email} disabled inputClassName="opacity-70" />
            <Input
              label="Phone"
              type="tel"
              value={form.phone}
              placeholder="+1 (555) 000-0000"
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
            />
            <Input
              label="Date of birth"
              type="date"
              value={form.dob}
              onChange={(event) => setForm({ ...form, dob: event.target.value })}
            />
            <Input
              label="Address"
              value={form.address}
              placeholder="Your address"
              className="sm:col-span-2"
              onChange={(event) => setForm({ ...form, address: event.target.value })}
            />

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Role</label>
              <Badge
                label={currentUser.role}
                color={currentUser.role === "admin" ? "gold" : currentUser.role === "PL" ? "blue" : currentUser.role === "member" ? "accent" : "muted"}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Joined</label>
              <p className="text-sm text-copy">{currentUser.createdAt}</p>
            </div>
          </div>

          {!editMode ? (
            <Btn onClick={() => setEditMode(true)}>Save changes</Btn>
          ) : (
            <div className="flex gap-2">
              <Btn onClick={handleSave}>Confirm</Btn>
              <Btn
                variant="ghost"
                onClick={() => {
                  setEditMode(false)
                  setForm({ 
                    name: currentUser.name, 
                    photo: currentUser.photo,
                    phone: currentUser.phone ?? "",
                    address: currentUser.address ?? "",
                    dob: currentUser.dob ?? "",
                  })
                }}
              >
                Cancel
              </Btn>
            </div>
          )}
        </Card>

        <Card>
          <h3 className="mb-5 text-sm font-semibold text-copy">Change Password</h3>
          <p className="mb-4 text-sm text-muted">Update your account password.</p>

          {!passwordMode ? (
            <Btn variant="ghost" onClick={() => setPasswordMode(true)}>Change password</Btn>
          ) : (
            <form className="grid gap-3" onSubmit={handlePasswordChange}>
              <Input
                label="Current password"
                type="password"
                placeholder="Enter current password"
                value={passwords.current}
                onChange={(event) => setPasswords({ ...passwords, current: event.target.value })}
              />
              <Input
                label="New password"
                type="password"
                placeholder="At least 6 characters"
                value={passwords.new}
                onChange={(event) => setPasswords({ ...passwords, new: event.target.value })}
              />
              <Input
                label="Confirm new password"
                type="password"
                placeholder="Re-enter new password"
                value={passwords.confirm}
                onChange={(event) => setPasswords({ ...passwords, confirm: event.target.value })}
              />

              {passwords.confirm && passwords.new !== passwords.confirm && (
                <p className="text-xs text-orange-200">Passwords do not match</p>
              )}

              {error && <p className="text-xs text-orange-200">{error}</p>}

              <div className="flex gap-2">
                <Btn type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update password"}
                </Btn>
                <Btn
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    setPasswordMode(false)
                    setPasswords({ current: "", new: "", confirm: "" })
                    setError("")
                  }}
                >
                  Cancel
                </Btn>
              </div>
            </form>
          )}
        </Card>
      </div>
    </Layout>
  )
}
