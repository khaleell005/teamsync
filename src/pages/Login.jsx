import { useState } from "react"
import { Input, Btn } from "../components/ui"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--base)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 52,
            height: 52,
            borderRadius: "var(--radius-lg)",
            background: "var(--surface)",
            border: "1px solid rgba(153,151,124,0.2)",
            marginBottom: 20,
            fontSize: 22,
          }}>◈</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>TeamSync</h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>Sign in to your workspace</p>
        </div>

        <div style={{
          background: "var(--surface)",
          borderRadius: "var(--radius-xl)",
          padding: "32px 28px",
          border: "1px solid rgba(153,151,124,0.15)",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Input
              label="Email address"
              type="email"
              placeholder="you@teamsync.io"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <div style={{ marginTop: 4 }}>
              <Btn style={{ width: "100%", justifyContent: "center" }}>
                Sign in
              </Btn>
            </div>
          </div>

          <div style={{
            marginTop: 24,
            padding: "12px 16px",
            background: "rgba(153,151,124,0.08)",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(153,151,124,0.12)",
          }}>
            <p style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.6 }}>
              <span style={{ color: "var(--accent)", fontWeight: 500 }}>Note:</span> Accounts are created by your team admin. Contact them if you don't have login credentials.
            </p>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "var(--faint)", marginTop: 24 }}>
          TeamSync · Role-based team workspace
        </p>
      </div>
    </div>
  )
}
