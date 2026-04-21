import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { Input, Btn, Card } from "../components/ui"
import { useAuth } from "../hooks/useAuth"
import { useSessionUser } from "../hooks/useSessionUser"
import { hasValidRole } from "../lib/session"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [resetMode, setResetMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  
  const { login, resetPassword } = useAuth()
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

  const handleResetPassword = async (event) => {
    event.preventDefault()

    if (!email) {
      setMessage("Please enter your email address")
      return
    }
    setLoading(true)
    setMessage("")
    try {
      await resetPassword(email)
      setResetSent(true)
    } catch {
      setMessage(" Unable to send reset email. Please check your email and try again.")
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
          {resetSent ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                <svg className="h-6 w-6 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-medium text-copy">Check your email</p>
                <p className="text-sm text-muted">We sent a password reset link to<br /><span className="text-accent">{email}</span></p>
              </div>
              <Btn variant="ghost" className="w-full" onClick={() => { setResetMode(false); setResetSent(false); setMessage(""); }}>
                Back to sign in
              </Btn>
            </div>
          ) : resetMode ? (
            <form className="flex flex-col gap-4.5" onSubmit={handleResetPassword}>
              <div className="space-y-2">
                <h2 className="text-lg font-medium text-copy">Reset password</h2>
                <p className="text-sm text-muted">Enter your email and we&apos;ll send you a link to reset your password.</p>
              </div>
              <Input
                label="Email address"
                type="email"
                placeholder="you@teamsync.io"
                autoComplete="username"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />

              {message && <p className="text-xs text-orange-200">{message}</p>}

              <div className="mt-1 flex flex-col gap-2">
                <Btn className="w-full" type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send reset link"}
                </Btn>
                <Btn variant="ghost" type="button" className="w-full" onClick={() => { setResetMode(false); setMessage(""); }}>
                  Back to sign in
                </Btn>
              </div>
            </form>
          ) : (
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

              <button
                type="button"
                onClick={() => setResetMode(true)}
                className="self-end text-xs text-accent transition hover:text-accent-strong"
              >
                Forgot password?
              </button>

              {message && <p className="text-xs text-orange-200">{message}</p>}

              <div className="mt-1">
                <Btn className="w-full" type="submit" disabled={loading}>
                  {loading ? "Please wait..." : "Sign in"}
                </Btn>
              </div>
            </form>
          )}

          {!resetMode && !resetSent && (
            <div className="mt-6 rounded-2xl border border-line/70 bg-white/[0.03] px-4 py-3">
              <p className="text-[11px] leading-6 text-muted">
                <span className="font-medium text-accent">Note:</span> Accounts are created by your team admin. Contact them if you don&apos;t have login credentials.
              </p>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-[11px] text-faint">
          TeamSync · Role-based team workspace
        </p>
      </div>
    </div>
  )
}
