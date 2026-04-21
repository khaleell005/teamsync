import { useState } from "react"
import { Navigate } from "react-router-dom"
import Layout from "../components/layout/Layout"
import { Card, Avatar, Badge, Btn, Input, PageHeader } from "../components/ui"
import { useUsers } from "../hooks/useUsers"
import { useSessionUser } from "../hooks/useSessionUser"

export default function Profile() {
  const { user: currentUser, setUser: setSessionUser } = useSessionUser()
  const { update: updateUser } = useUsers()
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({
    name: currentUser?.name ?? "",
    photo: currentUser?.photo ?? null,
  })

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  const handleSave = async () => {
    const updated = { ...currentUser, ...form }
    setSessionUser(updated)
    await updateUser(currentUser.id, form)
    setEditMode(false)
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
              <Avatar name={form.name} color={currentUser.color} size={80} />
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
                  setForm({ name: currentUser.name, photo: currentUser.photo })
                }}
              >
                Cancel
              </Btn>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  )
}
