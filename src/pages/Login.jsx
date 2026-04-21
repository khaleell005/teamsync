import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { Input, Btn } from "../components/ui"
import { useAuth } from "../hooks/useAuth"
import { useSessionUser } from "../hooks/useSessionUser"
import { hasValidRole } from "../lib/session"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  
  const { login } = useAuth()
  const { user: sessionUser, homeRoute } = useSessionUser()
  const navigate = useNavigate()

  if (sessionUser && hasValidRole(sessionUser)) {
    return <Navigate to={homeRoute} replace />
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    if (!email || !password) {
      setMessage("Please enter email and password")
      return
    }
    setLoading(true)
    setMessage("")
    try {
      const user = await login(email, password)
      if (user?.role === "admin") {
        navigate("/admin/dashboard")
      } else {
        navigate("/dashboard")
      }
    } catch {
      setMessage("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(214,174,71,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(184,176,143,0.12),transparent_20%)] px-6 py-10">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mb-5 inline-flex h-13 w-13 items-center justify-center rounded-3xl border border-line/70 bg-[linear-gradient(180deg,rgba(63,54,45,0.96),rgba(44,38,31,0.96))] text-[22px] shadow-soft">
            ◈
          </div>
          <h1 className="font-display text-3xl font-bold tracking-[-0.02em] text-copy">TeamSync</h1>
          <p className="mt-1.5 text-sm text-muted">Sign in to your workspace</p>
        </div>

        <div className="rounded-[28px] border border-line/70 bg-[linear-gradient(180deg,rgba(63,54,45,0.95)_0%,rgba(48,41,34,0.95)_100%)] px-7 py-8 shadow-panel backdrop-blur-xl">
          <form className="flex flex-col gap-4.5" onSubmit={handleLogin}>
            <Input
              label="Email address"
              type="email"
              placeholder="you@teamsync.io"
              autoComplete="username"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            {message && <p className="text-xs text-orange-200">{message}</p>}

            <div className="mt-1">
              <Btn className="w-full" type="submit" disabled={loading}>
                {loading ? "Please wait..." : "Sign in"}
              </Btn>
            </div>
          </form>

          <div className="mt-6 rounded-2xl border border-line/70 bg-white/[0.03] px-4 py-3">
            <p className="text-[11px] leading-6 text-muted">
              <span className="font-medium text-accent">Note:</span> Accounts are created by your team admin. Contact them if you don&apos;t have login credentials.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-faint">
          TeamSync · Role-based team workspace
        </p>
      </div>
    </div>
  )
}
