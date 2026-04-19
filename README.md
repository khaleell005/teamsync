# TeamSync

A team management application built with React, Vite, and Firebase.

## Features

- **Authentication**: Login system with role-based access
- **Admin Dashboard**: Manage team members, projects, and tasks
- **Member Dashboard**: View personal tasks and team activity
- **Project Management**: Create and track team projects
- **Task Management**: Assign and track tasks with priorities

## Roles

- **Admin**: Full access to manage members, projects, and tasks (including delete)
- **Project Lead (PM)**: Can create/assign tasks, edit any task, manage their project's members
- **Member**: View and edit own tasks, change task status
- **Viewer**: Read-only access

## Tech Stack

- React 19
- Vite 8
- React Router 7
- Firebase

## Getting Started

```bash
npm install
npm run dev
```

## Routes

| Path | Description |
|------|-------------|
| `/login` | Login page |
| `/admin/dashboard` | Admin dashboard |
| `/admin/members` | Manage team members |
| `/admin/projects` | Manage projects |
| `/admin/tasks` | Manage all tasks |
| `/dashboard` | Member dashboard |
| `/my-tasks` | Current user's tasks |
| `/team-view` | Team overview |