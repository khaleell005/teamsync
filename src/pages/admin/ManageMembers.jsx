import { useState } from "react"
import Layout from "../../components/layout/Layout"
import { Card, Avatar, Badge, Btn, Input, Select, PageHeader, Divider, LoadingScreen } from "../../components/ui"
import { useUsers } from "../../hooks/useUsers"
import { DEFAULT_MEMBER_COLORS, formatDisplayDate } from "../../lib/appData"
import { useSessionUser } from "../../hooks/useSessionUser"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "../../firebase/firebase"

export default function ManageMembers() {
  const { user: adminUser } = useSessionUser()
  const { users, loading, add, remove, fetchAll } = useUsers()
  const [state, setState] = useState({
    showForm: false,
    form: { name: "", email: "", password: "", role: "member", color: DEFAULT_MEMBER_COLORS[0] },
    saving: false,
    error: "",
  })

  if (!adminUser || loading) {
    return <LoadingScreen label="Loading members..." />
  }

  const { showForm, form, saving, error } = state

  const updateState = (updates) => setState((currentState) => ({ ...currentState, ...updates }))

  const handleAdd = async () => {
    if (!form.name || !form.email || !form.password) {
      updateState({ error: "Please fill in all fields" })
      return
    }

    updateState({ saving: true, error: "" })

    try {
      const authResult = await createUserWithEmailAndPassword(auth, form.email, form.password)
      
      await setDoc(doc(db, "users", authResult.user.uid), {
        name: form.name,
        email: form.email,
        role: form.role,
        color: form.color,
        createdAt: formatDisplayDate(),
        createdAtTimestamp: new Date(),
      })

      await fetchAll()

      updateState({
        form: { name: "", email: "", password: "", role: "member", color: DEFAULT_MEMBER_COLORS[0] },
        showForm: false,
        saving: false,
      })
    } catch (err) {
      updateState({ 
        error: err.code === "auth/email-already-in-use" 
          ? "Email already in use" 
          : "Failed to create account. Please try again.",
        saving: false 
      })
    }
  }

  return (
    <Layout role="admin" user={{ name: adminUser.name, role: adminUser.role, color: adminUser.color }}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Members"
          subtitle={`${users.length} team members in your workspace`}
          action={<Btn onClick={() => updateState({ showForm: !showForm })}>{showForm ? "Cancel" : "+ Add member"}</Btn>}
        />

        {showForm && (
          <Card>
            <h3 className="mb-5 text-sm font-semibold text-copy">Create member account</h3>
            <div className="mb-4 grid gap-4 sm:grid-cols-2">
              <Input label="Full name" placeholder="Tunde Musa" value={form.name} onChange={(event) => updateState({ form: { ...form, name: event.target.value } })} />
              <Input label="Email address" type="email" placeholder="tunde@teamsync.io" value={form.email} onChange={(event) => updateState({ form: { ...form, email: event.target.value } })} />
              <Input label="Temporary password" type="password" placeholder="••••••••" value={form.password} onChange={(event) => updateState({ form: { ...form, password: event.target.value } })} />
              <Select
                label="Role"
                value={form.role}
                onChange={(event) => updateState({ form: { ...form, role: event.target.value } })}
                options={[
                  { value: "member", label: "Member" },
                  { value: "PL", label: "Project Lead" },
                  { value: "viewer", label: "Viewer" },
                ]}
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-xs font-medium text-muted">Member color</label>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_MEMBER_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateState({ form: { ...form, color } })}
                      className="h-7 w-7 rounded-full transition"
                      style={{
                        backgroundColor: color,
                        boxShadow: form.color === color ? "0 0 0 2px rgba(245,240,232,0.9)" : "none",
                      }}
                    />
                  ))}
                </div>
                <label className="flex items-center gap-2 text-xs text-muted">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(event) => updateState({ form: { ...form, color: event.target.value } })}
                    className="h-7 w-7 cursor-pointer rounded-md border border-line/80 bg-transparent"
                  />
                  Custom
                </label>
              </div>
            </div>

            {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

            <Btn onClick={handleAdd} disabled={saving}>
              {saving ? "Creating..." : "Create account"}
            </Btn>
          </Card>
        )}

        <Card>
          <div className="overflow-x-auto">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-[2fr_2fr_1fr_1fr_120px] px-3 py-2 text-[10px] uppercase tracking-[0.1em] text-faint">
                {["Name", "Email", "Role", "Joined", ""].map((heading) => (
                  <span key={heading}>{heading}</span>
                ))}
              </div>

              <Divider />

              {users.map((member) => (
                <div key={member.id} className="grid grid-cols-[2fr_2fr_1fr_1fr_120px] items-center rounded-2xl px-3 py-3 transition hover:bg-white/[0.03]">
                  <div className="flex items-center gap-3">
                    <Avatar name={member.name} color={member.color} size={32} />
                    <p className="text-sm font-medium text-copy">{member.name}</p>
                  </div>
                  <p className="text-sm text-muted">{member.email}</p>
                  <Badge
                    label={member.role}
                    color={member.role === "admin" ? "gold" : member.role === "PL" ? "blue" : member.role === "member" ? "accent" : "muted"}
                  />
                  <p className="text-sm text-muted">{member.createdAt}</p>
                  <div className="flex justify-end">
                    {member.role !== "admin" && (
                      <Btn variant="danger" size="sm" onClick={() => remove(member.id)}>Remove</Btn>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
