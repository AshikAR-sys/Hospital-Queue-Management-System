import { useState } from "react";
import "./App.css";

const initialTokens = [];

export default function App() {
  const [page, setPage] = useState("home");
  const [role, setRole] = useState("patient");
  const [name, setName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [service, setService] = useState("Registration");
  const [tokens, setTokens] = useState(initialTokens);
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const activeTokens = tokens.filter((token) => token.status === "Waiting");
  const waitingCount = activeTokens.length;
  const completedCount = tokens.filter(
    (token) => token.status === "Completed"
  ).length;

  // Keep patient queue views limited to the signed-in patient's own tokens.
  const visibleTokens =
    page === "dashboard"
      ? tokens
      : tokens.filter((token) => token.ownerEmail === currentUser?.email);

  function login(event) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage("Please enter email and password.");
      return;
    }

    // Demo-only receptionist login. Use backend authentication in production.
    if (role === "staff") {
      if (
        email.trim().toLowerCase() !== "staff@carequeue.com" ||
        password !== "Staff@123"
      ) {
        setMessage("Invalid staff login details.");
        return;
      }

      setCurrentUser({
        name: "Receptionist",
        email: email.trim().toLowerCase(),
        role: "staff",
      });
      setPage("dashboard");
      setMessage("");
      return;
    }

    // Demo-only patient login. This is not real account authentication.
    const patientEmail = email.trim().toLowerCase();
    setCurrentUser({
      name: patientEmail.split("@")[0],
      email: patientEmail,
      role: "patient",
    });
    setPage("patient");
    setMessage("");
  }

  function generateToken(event) {
    event.preventDefault();

    if (!name.trim()) {
      setMessage("Please enter the patient's name.");
      return;
    }

    const prefix = service === "Registration" ? "R" : "B";
    const existingNumbers = tokens
      .filter((token) => token.service === service)
      .map((token) => Number(token.number.slice(1)))
      .filter(Number.isFinite);
    const nextNumber = Math.max(0, ...existingNumbers) + 1;

    const token = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      number: `${prefix}${String(nextNumber).padStart(3, "0")}`,
      name: name.trim(),
      patientId: patientId.trim() || "Walk-in",
      ownerEmail: currentUser?.email || "",
      service,
      status: "Waiting",
      createdAt: new Date().toLocaleTimeString(),
    };

    setTokens((oldTokens) => [...oldTokens, token]);
    setMessage(`Token ${token.number} generated successfully!`);
    setName("");
    setPatientId("");
  }

  function updateToken(id, status) {
    setTokens((oldTokens) =>
      oldTokens.map((token) =>
        token.id === id ? { ...token, status } : token
      )
    );
  }

  function logout() {
    setCurrentUser(null);
    setEmail("");
    setPassword("");
    setName("");
    setPatientId("");
    setPage("home");
    setRole("patient");
    setMessage("");
  }

  function openLogin(nextRole) {
    setRole(nextRole);
    setPage("login");
    setMessage("");
    setEmail("");
    setPassword("");
  }

  return (
    <main className="page">
      {/* Decorative medical symbols sit behind the page content. */}
      <div className="medical-symbol symbol-plus" aria-hidden="true">+</div>
      <div className="medical-symbol symbol-heart" aria-hidden="true">♡</div>
      <div className="medical-symbol symbol-pulse" aria-hidden="true">⌁</div>
      <div className="medical-symbol symbol-spark" aria-hidden="true">✳</div>
      <div className="medical-symbol symbol-plus-small" aria-hidden="true">✚</div>

      <header className="header">
        <button
          className="brand"
          type="button"
          onClick={() => {
            setPage("home");
            setMessage("");
          }}
          aria-label="CareQueue home"
        >
          <span className="brand-icon">+</span>
          <span>
            <strong>CareQueue</strong>
            <small>Hospital Digital Token System</small>
          </span>
        </button>

        <div className="header-actions">
          <span className="online">
            <i /> Queue Online
          </span>
          {currentUser ? (
            <button className="outline-btn" type="button" onClick={logout}>
              Logout
            </button>
          ) : (
            <button
              className="outline-btn"
              type="button"
              onClick={() => openLogin("staff")}
            >
              Staff Login
            </button>
          )}
        </div>
      </header>

      {page === "home" && (
        <>
          <section className="hero">
            <span className="tag">SMART HOSPITAL QUEUE</span>
            <h1>Your Care, Without the Wait.</h1>
            <p>
              Skip the uncertainty. Get your digital token and track
              your hospital queue.
            </p>

            <div className="hero-actions">
              <button
                className="primary-btn"
                type="button"
                onClick={() => openLogin("patient")}
              >
                Patient Register / Login →
              </button>
              <button
                className="outline-btn"
                type="button"
                onClick={() => openLogin("staff")}
              >
                Receptionist Portal
              </button>
            </div>
          </section>

          <section className="feature-grid">
            <article className="feature-card">
              <span className="feature-icon">01</span>
              <h3>Digital Token</h3>
              <p>Generate a queue token for registration or billing.</p>
            </article>
            <article className="feature-card">
              <span className="feature-icon">02</span>
              <h3>Live Queue View</h3>
              <p>See waiting, completed and currently active tokens.</p>
            </article>
            <article className="feature-card">
              <span className="feature-icon">03</span>
              <h3>Faster Service</h3>
              <p>Help the reception team organize patient flow.</p>
            </article>
          </section>
        </>
      )}

      {page === "login" && (
        <section className="auth-wrap">
          <form className="card auth-card" onSubmit={login}>
            <span className="tag">
              {role === "staff" ? "TEAM ACCESS" : "PATIENT ACCESS"}
            </span>
            <h2>
              {role === "staff"
                ? "Receptionist Login"
                : "Patient Register / Login"}
            </h2>
            <p className="muted">
              {role === "staff"
                ? "Sign in to manage hospital queues."
                : "Enter your details to continue to CareQueue."}
            </p>

            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter password"
              autoComplete={
                role === "staff" ? "current-password" : "new-password"
              }
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            {message && <p className="notice" role="status">{message}</p>}

            <button className="primary-btn full-btn" type="submit">
              {role === "staff" ? "Sign In to Dashboard" : "Continue →"}
            </button>

            {role === "staff" && (
              <p className="demo-note">
                Demo staff: staff@carequeue.com / Staff@123
              </p>
            )}

            <button
              type="button"
              className="text-btn"
              onClick={() => {
                setPage("home");
                setMessage("");
              }}
            >
              ← Back to home
            </button>
          </form>
        </section>
      )}

      {(page === "patient" || page === "dashboard") && (
        <section className="workspace">
          <div className="section-heading">
            <div>
              <span className="tag">
                {page === "dashboard" ? "RECEPTION DESK" : "PATIENT PORTAL"}
              </span>
              <h1>
                {page === "dashboard" ? "Queue Management" : "Get Your Token"}
              </h1>
              <p className="muted">
                {page === "dashboard"
                  ? "Manage patient flow from one place."
                  : "Enter your details and join the service queue."}
              </p>
            </div>
            <span className="online"><i /> System Ready</span>
          </div>

          <div className="stats-grid">
            <article className="stat-card">
              <span>{page === "dashboard" ? "Total Tokens" : "Your Tokens"}</span>
              <strong>
                {page === "dashboard" ? tokens.length : visibleTokens.length}
              </strong>
            </article>
            <article className="stat-card">
              <span>Waiting</span>
              <strong>
                {page === "dashboard"
                  ? waitingCount
                  : visibleTokens.filter((token) => token.status === "Waiting").length}
              </strong>
            </article>
            <article className="stat-card">
              <span>Completed</span>
              <strong>
                {page === "dashboard"
                  ? completedCount
                  : visibleTokens.filter((token) => token.status === "Completed").length}
              </strong>
            </article>
          </div>

          {page === "patient" && (
            <form className="card token-form" onSubmit={generateToken}>
              <h2>Join the Queue</h2>

              <label htmlFor="patient-name">Patient Name *</label>
              <input
                id="patient-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter full name"
                autoComplete="name"
                required
              />

              <label htmlFor="patient-id">Patient ID (optional)</label>
              <input
                id="patient-id"
                value={patientId}
                onChange={(event) => setPatientId(event.target.value)}
                placeholder="Enter patient ID"
              />

              <label>Select Service</label>
              <div className="choices">
                {["Registration", "Billing"].map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={service === item ? "choice selected" : "choice"}
                    aria-pressed={service === item}
                    onClick={() => setService(item)}
                  >
                    {item === "Registration" ? "▤" : "₹"} {item}
                  </button>
                ))}
              </div>

              {message && <p className="notice" role="status">{message}</p>}
              <button className="primary-btn full-btn" type="submit">
                Generate My Token →
              </button>
            </form>
          )}

          <section className="card queue-card">
            <div className="queue-heading">
              <h2>{page === "dashboard" ? "Patient Queue" : "Your Queue"}</h2>
              <span>
                {page === "dashboard"
                  ? `${activeTokens.length} waiting`
                  : `${visibleTokens.filter((token) => token.status === "Waiting").length} waiting`}
              </span>
            </div>

            {visibleTokens.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">▤</div>
                <h3>No tokens generated yet</h3>
                <p>New patient tokens will appear here.</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Token</th>
                      <th>Patient</th>
                      <th>Service</th>
                      <th>Status</th>
                      {page === "dashboard" && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleTokens.map((token) => (
                      <tr key={token.id}>
                        <td><strong>{token.number}</strong></td>
                        <td>
                          {page === "dashboard" ? token.name : token.name}
                          <small className="table-sub">{token.createdAt}</small>
                        </td>
                        <td>{token.service}</td>
                        <td>
                          <span className={`status ${token.status.toLowerCase()}`}>
                            {token.status}
                          </span>
                        </td>
                        {page === "dashboard" && (
                          <td className="actions">
                            {token.status === "Waiting" && (
                              <>
                                <button
                                  type="button"
                                  className="small-btn"
                                  onClick={() => updateToken(token.id, "Serving")}
                                >
                                  Call
                                </button>
                                <button
                                  type="button"
                                  className="small-btn success"
                                  onClick={() => updateToken(token.id, "Completed")}
                                >
                                  Complete
                                </button>
                                <button
                                  type="button"
                                  className="small-btn danger"
                                  onClick={() => updateToken(token.id, "Skipped")}
                                >
                                  Skip
                                </button>
                              </>
                            )}
                            {token.status === "Serving" && (
                              <button
                                type="button"
                                className="small-btn success"
                                onClick={() => updateToken(token.id, "Completed")}
                              >
                                Complete
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </section>
      )}

      <footer>
        <strong>CareQueue</strong> · A smarter way to manage hospital queues
        <span>Prototype · Queue data is temporary</span>
      </footer>
    </main>
  );
}
