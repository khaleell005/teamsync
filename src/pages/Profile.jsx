import { useState, useEffect, useRef } from "react"
import Layout from "../components/layout/Layout"
import { Card, Avatar, Badge, Btn, Input, PageHeader } from "../components/ui"
import { mockMembers } from "../utils/mockData"

export default function Profile() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("teamsync_user")
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [members, setMembers] = useState(mockMembers)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({ name: "", photo: null })
  const [passwordMode, setPasswordMode] = useState(false)
  const [selectedMember, setSelectedMember] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const fileInputRef = useRef(null)

  useEffect(() => {
    const stored = localStorage.getItem("teamsync_user")
    if (stored) {
      const user = JSON.parse(stored)
      setCurrentUser(user)
      setForm({ name: user.name, photo: user.photo })
    }
  }, [])

  const handleSave = () => {
    const updated = { ...currentUser, ...form }
    setCurrentUser(updated)
    localStorage.setItem("teamsync_user", JSON.stringify(updated))
    setMembers(prev => prev.map(m => m.id === currentUser.id ? { ...m, ...form } : m))
    setEditMode(false)
  }

  const handlePasswordChange = () => {
    if (!newPassword || !selectedMember) return
    setMembers(prev => prev.map(m => m.id === selectedMember ? { ...m, password: newPassword } : m))
    setNewPassword("")
    setSelectedMember("")
    setPasswordMode(false)
  }

  if (!currentUser) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p>Please log in to view your profile.</p>
        <a href="/login">Go to Login</a>
      </div>
    )
  }

  const isAdmin = currentUser.role === "admin"

  return (
    <Layout role={currentUser.role} user={currentUser}>
      <PageHeader
        title="Profile"
        subtitle="Manage your account settings"
      />

      <div style={{ display: "grid", gap: 24, maxWidth: 600 }}>
        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>Your Profile</h3>
          
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
            {form.photo ? (
              <img src={form.photo} alt="Profile" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <Avatar name={form.name} color={currentUser.color} size={80} />
            )}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "var(--accent)", fontWeight: 500 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => setForm({ ...form, photo: reader.result })
                      reader.readAsDataURL(file)
                    }
                  }}
                  style={{ display: "none" }}
                />
                {form.photo ? "Change photo" : "Add photo"}
              </label>
              {form.photo && (
                <button
                  onClick={() => setForm({ ...form, photo: null })}
                  style={{ display: "block", marginTop: 6, fontSize: 11, color: "var(--muted)", background: "none", border: "none", cursor: "pointer" }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <Input
              label="Display name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>Email</label>
              <input
                value={currentUser.email}
                disabled
                style={{
                  background: "var(--surface)", border: "1px solid rgba(153,151,124,0.2)",
                  borderRadius: "var(--radius-md)", padding: "9px 12px", fontSize: 13,
                  color: "var(--muted)", opacity: 0.7,
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500, display: "block", marginBottom: 6 }}>Role</label>
              <Badge
                label={currentUser.role}
                color={currentUser.role === "admin" ? "gold" : currentUser.role === "pm" ? "blue" : currentUser.role === "member" ? "accent" : "muted"}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500, display: "block", marginBottom: 6 }}>Joined</label>
              <p style={{ fontSize: 13, color: "var(--text)" }}>{currentUser.createdAt}</p>
            </div>
          </div>

          {!editMode ? (
            <Btn onClick={() => setEditMode(true)}>Save changes</Btn>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <Btn onClick={handleSave}>Confirm</Btn>
              <Btn variant="ghost" onClick={() => { setEditMode(false); setForm({ name: currentUser.name, photo: currentUser.photo }) }}>Cancel</Btn>
            </div>
          )}
        </Card>

        {isAdmin && (
          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>Manage Member Passwords</h3>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>As admin, you can view or reset passwords for team members.</p>
            
            {!passwordMode ? (
              <Btn onClick={() => setPasswordMode(true)}>Change member password</Btn>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, alignItems: "flex-end" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>Select member</label>
                  <select
                    value={selectedMember}
                    onChange={e => setSelectedMember(e.target.value)}
                    style={{
                      background: "var(--surface)", border: "1px solid rgba(153,151,124,0.2)",
                      borderRadius: "var(--radius-md)", padding: "9px 12px", fontSize: 13,
                      color: "var(--text)", cursor: "pointer",
                    }}
                  >
                    <option value="">Select member...</option>
                    {members.filter(m => m.role !== "admin").map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="New password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn onClick={handlePasswordChange}>Update</Btn>
                  <Btn variant="ghost" onClick={() => { setPasswordMode(false); setSelectedMember(""); setNewPassword("") }}>Cancel</Btn>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </Layout>
  )
}