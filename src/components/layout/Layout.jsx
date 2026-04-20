import Sidebar from "./Sidebar"

export default function Layout({ children, role, user }) {
  return (
    <div className="min-h-screen lg:flex">
      <Sidebar role={role} user={user} />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-7">
        <div className="mx-auto w-full max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
