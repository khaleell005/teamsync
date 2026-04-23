import { useState } from "react"
import Layout from "../../components/layout/Layout"
import { Card, Avatar, StatusBadge, PriorityDot, Btn, Input, Select, TextArea, PageHeader, Modal, EmptyState, LoadingScreen } from "../../components/ui"
import { useTasks } from "../../hooks/useTasks"
import { useProjects } from "../../hooks/useProjects"
import { useUsers } from "../../hooks/useUsers"
import { formatDisplayDate } from "../../lib/appData"
import { useSessionUser } from "../../hooks/useSessionUser"
import { cn } from "../../lib/cn"

export default function ManageTasks() {
  const { user: adminUser } = useSessionUser()
  const { tasks, add: addTask, update: updateTask, remove: removeTask, loading: tasksLoading } = useTasks()
  const { projects, loading: projectsLoading } = useProjects()
  const { users, loading: usersLoading } = useUsers()
  const [state, setState] = useState({
    showForm: false,
    filter: "all",
    editingId: null,
    form: { title: "", description: "", projectId: "", assignedTo: "", priority: "medium", deadline: "" },
  })

  if (!adminUser || tasksLoading || projectsLoading || usersLoading) {
    return <LoadingScreen label="Loading tasks..." />
  }

  const { showForm, filter, editingId, form } = state
  const updateState = (updates) => setState((currentState) => ({ ...currentState, ...updates }))
  const getUser = (id) => users.find((user) => user.id === id)
  const getProject = (id) => projects.find((project) => project.id === id)
  const filteredTasks = filter === "all" ? tasks : tasks.filter((task) => task.status === filter)
  const closeForm = () =>
    updateState({
      showForm: false,
      editingId: null,
      form: { title: "", description: "", projectId: "", assignedTo: "", priority: "medium", deadline: "" },
    })

  const handleAdd = async () => {
    if (!form.title || !form.projectId) return

    await addTask({
      ...form,
      assignedTo: form.assignedTo || null,
      status: "not_started",
      progressNote: "",
      createdAt: formatDisplayDate(),
    })

    updateState({
      form: { title: "", description: "", projectId: "", assignedTo: "", priority: "medium", deadline: "" },
      showForm: false,
    })
  }

  const handleEdit = (task) => {
    updateState({
      form: {
        title: task.title,
        description: task.description || "",
        projectId: task.projectId,
        assignedTo: task.assignedTo || "",
        priority: task.priority,
        deadline: task.deadline || "",
      },
      editingId: task.id,
      showForm: true,
    })
  }

  const handleUpdate = async () => {
    if (!form.title || !form.projectId) return

    const currentTask = tasks.find((task) => task.id === editingId)
    await updateTask(editingId, {
      ...currentTask,
      ...form,
      assignedTo: form.assignedTo || null,
    })

    updateState({
      form: { title: "", description: "", projectId: "", assignedTo: "", priority: "medium", deadline: "" },
      editingId: null,
      showForm: false,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (editingId) {
      await handleUpdate()
      return
    }

    await handleAdd()
  }

  const projectOptions = [{ value: "", label: "Select project" }, ...projects.map((project) => ({ value: project.id, label: project.name }))]
  const memberOptions = [{ value: "", label: "Unassigned" }, ...users.filter((user) => user.role !== "admin").map((user) => ({ value: user.id, label: user.name }))]
  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ]
  const filterTabs = [
    { key: "all", label: "All" },
    { key: "not_started", label: "Not started" },
    { key: "in_progress", label: "In progress" },
    { key: "completed", label: "Completed" },
  ]
  const taskTableColumns = "grid-cols-[minmax(220px,2.7fr)_minmax(170px,1.6fr)_minmax(160px,1.3fr)_minmax(130px,1fr)_minmax(140px,1fr)_minmax(190px,1.3fr)]"

  return (
    <Layout role="admin" user={{ name: adminUser.name, role: adminUser.role, color: adminUser.color }}>
      <div className="flex flex-col gap-5 sm:gap-6">
        <PageHeader
          title="Tasks"
          subtitle={`${tasks.length} total tasks across all projects`}
          action={
            <Btn
              onClick={() =>
                updateState({
                  showForm: true,
                  editingId: null,
                  form: { title: "", description: "", projectId: "", assignedTo: "", priority: "medium", deadline: "" },
                })
              }
            >
              + New task
            </Btn>
          }
        />

        <Modal open={showForm} onClose={closeForm} className="max-w-5xl">
          <Card>
            <h3 className="mb-5 text-sm font-semibold text-copy">{editingId ? "Edit task" : "Create task"}</h3>
            <form className="space-y-4.5" onSubmit={handleSubmit}>
              <div className="grid gap-4.5 sm:grid-cols-2">
                <Input label="Task title" placeholder="e.g. Redesign landing page" value={form.title} onChange={(event) => updateState({ form: { ...form, title: event.target.value } })} />
                <Select label="Project" value={form.projectId} onChange={(event) => updateState({ form: { ...form, projectId: event.target.value } })} options={projectOptions} />
                <Select label="Assign to" value={form.assignedTo} onChange={(event) => updateState({ form: { ...form, assignedTo: event.target.value } })} options={memberOptions} />
                <Select label="Priority" value={form.priority} onChange={(event) => updateState({ form: { ...form, priority: event.target.value } })} options={priorityOptions} />
                <Input label="Deadline" type="text" placeholder="e.g. Apr 30, 2025" value={form.deadline} onChange={(event) => updateState({ form: { ...form, deadline: event.target.value } })} />
                <TextArea
                  className="sm:col-span-2"
                  label="Description"
                  placeholder="Task details..."
                  value={form.description}
                  onChange={(event) => updateState({ form: { ...form, description: event.target.value } })}
                  rows={3}
                />
              </div>
              <div className="flex flex-wrap justify-end gap-2 border-t border-line/50 pt-3">
                <Btn type="button" variant="ghost" onClick={closeForm}>Cancel</Btn>
                <Btn type="submit">{editingId ? "Update task" : "Create task"}</Btn>
              </div>
            </form>
          </Card>
        </Modal>

        <div className="flex flex-wrap gap-2.5">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => updateState({ filter: tab.key })}
              className={`rounded-full border px-3.5 py-1.5 text-xs transition ${
                filter === tab.key
                  ? "border-accent bg-[linear-gradient(180deg,var(--color-accent-strong),var(--color-accent))] font-medium text-canvas"
                  : "border-line/80 bg-white/[0.03] text-muted hover:text-copy"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[980px]">
              <div className={cn("grid border-b border-line/60 px-5 py-3 text-[10px] uppercase tracking-[0.1em] text-faint", taskTableColumns)}>
                {["Task", "Project", "Assignee", "Priority", "Status", ""].map((heading) => (
                  <span key={heading}>{heading}</span>
                ))}
              </div>

              {filteredTasks.length === 0 && (
                <div className="px-5 py-10">
                  <EmptyState message="No tasks found." />
                </div>
              )}

              {filteredTasks.map((task) => {
                const assignee = getUser(task.assignedTo)
                const project = getProject(task.projectId)

                return (
                  <div
                    key={task.id}
                    className={cn(
                      "grid items-center border-b border-line/35 px-5 py-3.5 transition hover:bg-white/[0.03] last:border-b-0",
                      taskTableColumns,
                    )}
                  >
                    <div className="pr-3">
                      <p className="truncate text-sm font-medium text-copy">{task.title}</p>
                      {task.deadline && <p className="mt-0.5 text-[11px] text-muted">Due {task.deadline}</p>}
                    </div>
                    <p className="truncate pr-3 text-sm text-muted">{project?.name || "—"}</p>
                    <div className="flex items-center gap-2 pr-3">
                      {assignee ? (
                        <>
                          <Avatar name={assignee.name} color={assignee.color} photo={assignee.photo} size={22} />
                          <span className="truncate text-sm text-muted">{assignee.name.split(" ")[0]}</span>
                        </>
                      ) : (
                        <span className="text-[11px] text-faint">Unassigned</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 pr-3">
                      <PriorityDot priority={task.priority} />
                      <span className="text-sm capitalize text-muted">{task.priority}</span>
                    </div>
                    <div>
                      <StatusBadge status={task.status} />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Btn variant="ghost" size="sm" onClick={() => handleEdit(task)}>Edit</Btn>
                      <Btn variant="danger" size="sm" onClick={() => removeTask(task.id)}>Delete</Btn>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
