import { useState } from "react"
import Layout from "../../components/layout/Layout"
import { Card, Avatar, Badge, Btn, Input, TextArea, PageHeader, Divider, Modal, EmptyState, LoadingScreen } from "../../components/ui"
import { useProjects } from "../../hooks/useProjects"
import { useUsers } from "../../hooks/useUsers"
import { useTasks } from "../../hooks/useTasks"
import { formatDisplayDate } from "../../lib/appData"
import { useSessionUser } from "../../hooks/useSessionUser"

export default function ManageProjects() {
  const { user: adminUser } = useSessionUser()
  const { projects, add, update, loading: projectsLoading } = useProjects()
  const { users: userList, loading: usersLoading } = useUsers()
  const { tasks: taskList, loading: tasksLoading } = useTasks()
  const [state, setState] = useState({
    showForm: false,
    form: { name: "", description: "", leadId: "", memberIds: [] },
  })

  if (!adminUser || projectsLoading || usersLoading || tasksLoading) {
    return <LoadingScreen label="Loading projects..." />
  }

  const { showForm, form } = state
  const updateState = (updates) => setState((currentState) => ({ ...currentState, ...updates }))
  const getUser = (id) => userList.find((user) => user.id === id)
  const getTaskCount = (projectId) => taskList.filter((task) => task.projectId === projectId).length
  const closeForm = () => updateState({ showForm: false, form: { name: "", description: "", leadId: "", memberIds: [] } })

  const toggleMember = (id) => {
    updateState({
      form: {
        ...form,
        memberIds: form.memberIds.includes(id)
          ? form.memberIds.filter((memberId) => memberId !== id)
          : [...form.memberIds, id],
      },
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await handleAdd()
  }

  const handleAdd = async () => {
    if (!form.name) return

    await add({
      ...form,
      status: "active",
      createdAt: formatDisplayDate(),
    })

    updateState({
      form: { name: "", description: "", leadId: "", memberIds: [] },
      showForm: false,
    })
  }

  const toggleStatus = async (id) => {
    const project = projects.find((item) => item.id === id)
    if (!project) return

    await update(id, {
      ...project,
      status: project.status === "active" ? "completed" : "active",
    })
  }

  return (
    <Layout role="admin" user={{ name: adminUser.name, role: adminUser.role, color: adminUser.color }}>
      <div className="flex flex-col gap-5 sm:gap-6">
        <PageHeader
          title="Projects"
          subtitle={`${projects.filter((project) => project.status === "active").length} active · ${projects.filter((project) => project.status === "completed").length} completed`}
          action={<Btn onClick={() => updateState({ showForm: true })}>+ New project</Btn>}
        />

        <Modal open={showForm} onClose={closeForm} className="max-w-4xl">
          <Card>
            <h3 className="mb-5 text-sm font-semibold text-copy">Create project</h3>
            <form className="space-y-4.5" onSubmit={handleSubmit}>
              <Input label="Project name" placeholder="e.g. NexaFlow Rebrand" value={form.name} onChange={(event) => updateState({ form: { ...form, name: event.target.value } })} />

              <div>
                <label className="mb-2 block text-xs font-medium text-muted">Project Lead</label>
                <div className="flex flex-wrap gap-2.5">
                  {userList.filter((user) => user.role === "PL" || user.role === "member").map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => updateState({ form: { ...form, leadId: user.id } })}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
                        form.leadId === user.id
                          ? "border-accent/60 bg-accent/18 text-copy"
                          : "border-line/70 bg-surface/70 text-muted hover:text-copy"
                      }`}
                    >
                      <Avatar name={user.name} color={user.color} size={20} />
                      <span>{user.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <TextArea
                label="Description"
                placeholder="Brief description of this project..."
                value={form.description}
                onChange={(event) => updateState({ form: { ...form, description: event.target.value } })}
                rows={3}
              />

              <div>
                <label className="mb-2 block text-xs font-medium text-muted">Assign members</label>
                <div className="flex flex-wrap gap-2.5">
                  {userList.filter((user) => user.role !== "admin").map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => toggleMember(user.id)}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
                        form.memberIds.includes(user.id)
                          ? "border-accent/60 bg-accent/18 text-copy"
                          : "border-line/70 bg-surface/70 text-muted hover:text-copy"
                      }`}
                    >
                      <Avatar name={user.name} color={user.color} size={20} />
                      <span>{user.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2 border-t border-line/50 pt-3">
                <Btn type="button" variant="ghost" onClick={closeForm}>Cancel</Btn>
                <Btn type="submit">Create project</Btn>
              </div>
            </form>
          </Card>
        </Modal>

        <div className="grid gap-4 lg:gap-5 xl:grid-cols-2">
          {projects.length === 0 && <EmptyState message="No projects yet. Create your first one." />}

          {projects.map((project) => (
            <Card key={project.id}>
              <div className="mb-3.5 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15px] font-semibold text-copy">{project.name}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{project.description}</p>
                </div>
                <Badge label={project.status === "active" ? "Active" : "Completed"} color={project.status === "active" ? "success" : "muted"} />
              </div>

              <Divider />

              <div className="flex flex-wrap items-center justify-between gap-3.5">
                <div className="flex flex-wrap items-center gap-y-2">
                  {project.leadId && getUser(project.leadId) && (
                    <div className="mr-2 flex items-center gap-1.5">
                      <span className="text-[10px] text-muted">Lead:</span>
                      <Avatar name={getUser(project.leadId).name} color={getUser(project.leadId).color} size={22} />
                    </div>
                  )}
                  {project.memberIds.map((memberId) => {
                    const member = getUser(memberId)
                    return member && member.id !== project.leadId ? (
                      <div key={memberId} className="-mr-1.5" title={member.name}>
                        <Avatar name={member.name} color={member.color} size={26} />
                      </div>
                    ) : null
                  })}
                  <span className="ml-4 text-[11px] text-muted">{project.memberIds.length} members</span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[11px] text-muted">{getTaskCount(project.id)} tasks</span>
                  <Btn variant="ghost" size="sm" onClick={() => toggleStatus(project.id)}>
                    {project.status === "active" ? "Mark done" : "Reopen"}
                  </Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}
