import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "@/config";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSubmitting) return;

    if (isSignUp && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = isSignUp ? "/api/auth/register" : "/api/auth/login";
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: isSignUp ? name : undefined,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong");
      }

      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }
      if (data.user) {
        localStorage.setItem("auth_user", JSON.stringify(data.user));
      }

      navigate("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to authenticate";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    // Demo helper / placeholder
    localStorage.setItem("auth_token", "demo_token");
    localStorage.setItem("auth_user", JSON.stringify({ name: "Demo User", email: "demo@example.com" }));
    navigate("/dashboard");
  };

  return (
    <div className="pg-root">
      <div className="pg-card">

        {/* ── Top banner ── */}
        <div className="pg-card-top">
          <div className="pg-logo-row">
            <div className="pg-logo-icon">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" fill="white" />
              </svg>
            </div>
            <span className="pg-logo-text">
              PortGen <span>AI</span>
            </span>
          </div>
          <h1>{isSignUp ? "Create Account" : "Welcome Back"}</h1>
          <p>{isSignUp ? "Start building your portfolio today" : "Sign in to your account"}</p>
        </div>

        {/* ── Form body ── */}
        <div className="pg-card-body">

          {/* Google */}
          <button type="button" className="pg-google-btn" onClick={handleGoogleLogin}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.4 1.2 8.7 3.2l6.5-6.5C35.3 2.7 30 .5 24 .5 14.8.5 6.9 5.9 3.2 13.9l7.6 5.9C12.5 13.5 17.8 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.5 2.8-2.2 5.2-4.7 6.8l7.4 5.7c4.3-4 6.8-9.9 7.1-16.5z"/>
              <path fill="#FBBC05" d="M10.8 28.7A14.3 14.3 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7L2.7 13.4A23.4 23.4 0 0 0 .5 24c0 3.8.9 7.4 2.5 10.6l7.8-5.9z"/>
              <path fill="#34A853" d="M24 47.5c6 0 11-2 14.7-5.4l-7.4-5.7c-2 1.3-4.6 2.1-7.3 2.1-6.2 0-11.5-4-13.4-9.5l-7.7 5.9C6.7 42.1 14.7 47.5 24 47.5z"/>
            </svg>
            Continue with Google
          </button>

          <div className="pg-divider">
            <span>or continue with email</span>
          </div>

          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="pg-field">
                <label htmlFor="name">Full Name</label>
                <div className="pg-field-wrap">
                  <svg className="pg-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="pg-field">
              <label htmlFor="email">Email address</label>
              <div className="pg-field-wrap">
                <svg className="pg-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
                </svg>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="pg-field">
              <label htmlFor="password">Password</label>
              <div className="pg-field-wrap">
                <svg className="pg-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              {!isSignUp && (
                <div className="pg-forgot">
                  <span className="cursor-pointer" style={{ color: "#4361EE", fontSize: "12px", textDecoration: "none", fontWeight: 500 }}>Forgot password?</span>
                </div>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-500 mb-3" style={{ color: "red", fontSize: "13px" }}>{error}</p>
            )}

            <button type="submit" className="pg-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (isSignUp ? "Creating account..." : "Signing in...") : isSignUp ? "Create Account" : "Sign In"} &nbsp;→
            </button>
          </form>

          <p className="pg-signup-row">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
              className="text-primary hover:underline font-semibold bg-transparent border-none p-0 cursor-pointer"
              style={{ color: "#4361EE", fontWeight: 600, border: "none", background: "none" }}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>

        {/* ── Footer nav ── */}
        <nav className="pg-nav-hint">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/templates">Templates</Link>
          <Link to="/case-study">Case Study</Link>
        </nav>

      </div>

      <style>{`
        /* ─── Page wrapper ─── */
        .pg-root {
          min-height: 100vh;
          background: linear-gradient(135deg, hsl(36 30% 94%), hsl(36 20% 89%));
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: 'Inter', sans-serif;
        }

        /* ─── Card ─── */
        .pg-card {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 4px 40px rgba(67,97,238,.09), 0 1px 4px rgba(67,97,238,.06);
          width: 100%;
          max-width: 420px;
          overflow: hidden;
        }

        /* ─── Top banner ─── */
        .pg-card-top {
          background: linear-gradient(145deg, #1E3A8A 0%, #3B5BDB 60%, #4361EE 100%);
          padding: 36px 36px 30px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .pg-card-top::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 130px; height: 130px;
          border-radius: 50%;
          background: rgba(255,255,255,.07);
        }
        .pg-card-top::after {
          content: '';
          position: absolute;
          bottom: -30px; left: -30px;
          width: 90px; height: 90px;
          border-radius: 50%;
          background: rgba(255,255,255,.05);
        }
        .pg-logo-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 18px;
          position: relative;
          z-index: 1;
        }
        .pg-logo-icon {
          width: 34px; height: 34px;
          background: rgba(255,255,255,.2);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pg-logo-text {
          font-family: 'Outfit', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #fff;
        }
        .pg-logo-text span { color: #93C5FD; }

        .pg-card-top h1 {
          font-family: 'Outfit', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 5px;
          position: relative;
          z-index: 1;
        }
        .pg-card-top p {
          font-size: 13px;
          color: rgba(255,255,255,.7);
          position: relative;
          z-index: 1;
        }

        /* ─── Body ─── */
        .pg-card-body { padding: 28px 32px 28px; }

        /* Google button */
        .pg-google-btn {
          width: 100%;
          height: 46px;
          border-radius: 11px;
          border: 1.5px solid #E2E8F0;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          font-size: 14px;
          font-weight: 500;
          color: #1E293B;
          cursor: pointer;
          transition: border-color .18s, background .18s;
          font-family: 'Inter', sans-serif;
        }
        .pg-google-btn:hover {
          border-color: #4361EE;
          background: #F5F8FF;
        }

        /* Divider */
        .pg-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 18px 0;
          font-size: 12px;
          color: #94A3B8;
        }
        .pg-divider::before,
        .pg-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #EEF1F8;
        }

        /* Fields */
        .pg-field { margin-bottom: 15px; }
        .pg-field label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #334155;
          margin-bottom: 6px;
          text-align: left;
        }
        .pg-field-wrap { position: relative; display: flex; align-items: center; }
        .pg-input-icon {
          position: absolute;
          left: 13px;
          width: 16px; height: 16px;
          color: #94A3B8;
          pointer-events: none;
        }
        .pg-field-wrap input {
          width: 100%;
          height: 46px;
          border: 1.5px solid #E2E8F0;
          border-radius: 11px;
          padding: 0 13px 0 40px;
          font-size: 14px;
          color: #1E293B;
          background: #F8FAFF;
          outline: none;
          transition: border-color .18s, box-shadow .18s, background .18s;
          font-family: 'Inter', sans-serif;
        }
        .pg-field-wrap input:focus {
          border-color: #4361EE;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(67,97,238,.1);
        }
        .pg-forgot {
          display: flex;
          justify-content: flex-end;
          margin-top: 5px;
        }

        /* Submit */
        .pg-submit-btn {
          width: 100%;
          height: 48px;
          border-radius: 11px;
          background: linear-gradient(135deg, #1E3A8A, #4361EE);
          border: none;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 6px;
          transition: box-shadow .2s, transform .2s;
          letter-spacing: .2px;
        }
        .pg-submit-btn:hover {
          box-shadow: 0 6px 20px rgba(67,97,238,.35);
          transform: translateY(-1px);
        }
        .pg-submit-btn:active { transform: translateY(0); }

        /* Sign up row */
        .pg-signup-row {
          text-align: center;
          margin-top: 18px;
          font-size: 13px;
          color: #64748B;
        }
        .pg-signup-row a {
          color: #4361EE;
          text-decoration: none;
          font-weight: 600;
        }

        /* Bottom nav */
        .pg-nav-hint {
          display: flex;
          justify-content: center;
          gap: 20px;
          padding: 14px 32px;
          border-top: 1px solid #F1F5FF;
        }
        .pg-nav-hint a {
          font-size: 12px;
          color: #94A3B8;
          text-decoration: none;
          font-weight: 500;
          transition: color .15s;
        }
        .pg-nav-hint a:hover { color: #4361EE; }

        /* ─── Mobile ─── */
        @media (max-width: 480px) {
          .pg-root { padding: 16px; }
          .pg-card-top { padding: 26px 22px 22px; }
          .pg-card-top h1 { font-size: 20px; }
          .pg-card-body { padding: 22px 20px 24px; }
          .pg-nav-hint { padding: 12px 20px; gap: 14px; }
        }
      `}</style>
    </div>
  );
}
