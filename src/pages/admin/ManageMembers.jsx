import { useState } from "react"
import Layout from "../../components/layout/Layout"
import { Card, Avatar, Badge, Btn, Input, Select, PageHeader, Modal, EmptyState, LoadingScreen } from "../../components/ui"
import { useUsers } from "../../hooks/useUsers"
import { DEFAULT_MEMBER_COLORS, createDefaultMemberForm, formatDisplayDate } from "../../lib/appData"
import { useSessionUser } from "../../hooks/useSessionUser"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { db, runWithSecondaryAuth } from "../../firebase/firebase"
import { cn } from "../../lib/cn"

export default function ManageMembers() {
  const { user: adminUser } = useSessionUser()
  const { users, loading, remove } = useUsers()
  const [state, setState] = useState({
    showForm: false,
    form: createDefaultMemberForm(),
    saving: false,
    error: "",
  })

  if (!adminUser || loading) {
    return <LoadingScreen label="Loading members..." />
  }

  const { showForm, form, saving, error } = state

  const updateState = (updates) => setState((currentState) => ({ ...currentState, ...updates }))

  const getColorChipClassName = (color) =>
    cn(
      "h-7 w-7 rounded-full bg-[var(--chip-color)] transition",
      form.color === color ? "ring-2 ring-copy/90 ring-offset-2 ring-offset-canvas" : "hover:ring-1 hover:ring-copy/35",
    )

  const memberTableColumns = "grid-cols-[minmax(220px,2.1fr)_minmax(280px,2.4fr)_minmax(140px,1fr)_minmax(140px,1fr)_minmax(170px,1.3fr)]"
  const closeForm = () => updateState({ showForm: false, error: "", form: createDefaultMemberForm(), saving: false })

  const handleAdd = async () => {
    if (!form.name || !form.email || !form.password) {
      updateState({ error: "Please fill in all fields" })
      return
    }

    updateState({ saving: true, error: "" })

    try {
      const authResult = await runWithSecondaryAuth((secondaryAuth) =>
        createUserWithEmailAndPassword(secondaryAuth, form.email, form.password),
      )
      
      await setDoc(doc(db, "users", authResult.user.uid), {
        name: form.name,
        email: form.email,
        role: form.role,
        color: form.color,
        createdAt: formatDisplayDate(),
        createdAtTimestamp: serverTimestamp(),
      })

      updateState({
        form: createDefaultMemberForm(),
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    await handleAdd()
  }

  return (
    <Layout role="admin" user={{ name: adminUser.name, role: adminUser.role, color: adminUser.color }}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Members"
          subtitle={`${users.length} team members in your workspace`}
          action={<Btn onClick={() => updateState({ showForm: true })}>+ Add member</Btn>}
        />

        <Modal open={showForm} onClose={() => !saving && closeForm()} className="max-w-3xl">
          <Card>
            <h3 className="mb-5 text-sm font-semibold text-copy">Create member account</h3>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
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

              <div>
                <label className="mb-2 block text-xs font-medium text-muted">Member color</label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_MEMBER_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => updateState({ form: { ...form, color } })}
                        className={getColorChipClassName(color)}
                        style={{ "--chip-color": color }}
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

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex flex-wrap justify-end gap-2 border-t border-line/50 pt-3">
                <Btn type="button" variant="ghost" disabled={saving} onClick={closeForm}>Cancel</Btn>
                <Btn type="submit" disabled={saving}>{saving ? "Creating..." : "Create account"}</Btn>
              </div>
            </form>
          </Card>
        </Modal>

        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[980px]">
              <div className={cn("grid border-b border-line/60 px-5 py-3 text-[10px] uppercase tracking-[0.1em] text-faint", memberTableColumns)}>
                {["Name", "Email", "Role", "Joined", ""].map((heading) => (
                  <span key={heading}>{heading}</span>
                ))}
              </div>

              {users.length === 0 && (
                <div className="px-5 py-10">
                  <EmptyState message="No members yet." />
                </div>
              )}

              {users.map((member) => (
                <div
                  key={member.id}
                  className={cn(
                    "grid items-center border-b border-line/35 px-5 py-3.5 transition hover:bg-white/[0.03] last:border-b-0",
                    memberTableColumns,
                  )}
                >
                  <div className="flex items-center gap-3 pr-4">
                    <Avatar name={member.name} color={member.color} size={32} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-copy">{member.name}</p>
                    </div>
                  </div>
                  <p className="truncate pr-4 text-sm text-muted">{member.email}</p>
                  <div>
                    <Badge
                      label={member.role}
                      color={member.role === "admin" ? "gold" : member.role === "PL" ? "blue" : member.role === "member" ? "accent" : "muted"}
                    />
                  </div>
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
