import React, { useEffect, useState } from "react";
import {EyeOff, Eye} from 'lucide-react'
import useAxios from "../../hooks/useAxios";
import { loginResponse } from "../../models/loginResponse";
import { setCookie } from "../../util/cookie/Cookie";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

  const fetch = useAxios<loginResponse>({
		method: 'post',
		url: '/login',
		data: {
			email,
			password: `${password}`,
		},
	});

  const onClickHandle = () => {
    fetch[1]();
  }

  useEffect(()=>{
    if(fetch[0].response){
      const {accessToken} = fetch[0].response;
      setCookie('AccessToken', `Bearer ${accessToken}`)
    }
  },[fetch[0].response])

  return (
    <div
      className="min-h-screen w-full flex"
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "var(--background)",
      }}
    >
      {/* Left panel — decorative */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-16 relative overflow-hidden"
        style={{ background: "var(--secondary)" }}
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Decorative circle */}
        <div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10">
          <span
            className="text-xs tracking-[0.3em] uppercase"
            style={{
              color: "var(--primary)",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            Est. 2024
          </span>
        </div>

        <div className="relative z-10">
          <h1
            className="text-6xl leading-tight mb-6"
            style={{
              fontFamily: "'Cormorant', serif",
              fontWeight: 300,
              color: "var(--foreground)",
            }}
          >
            Welcome
            <br />
            <em style={{ color: "var(--primary)" }}>back.</em>
          </h1>
          <p
            className="text-sm leading-relaxed max-w-xs"
            style={{ color: "var(--muted-foreground)" }}
          >
            Sign in to access your workspace and continue where you left off.
          </p>
        </div>

        <div
          className="relative z-10 text-xs tracking-widest uppercase"
          style={{
            color: "var(--muted-foreground)",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          Secure · Private · Yours
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-12">
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{
                color: "var(--primary)",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              Est. 2024
            </span>
          </div>

          <div className="mb-10">
            <h2
              className="text-4xl mb-2"
              style={{
                fontFamily: "'Cormorant', serif",
                fontWeight: 300,
                color: "var(--foreground)",
              }}
            >
              Sign in
            </h2>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              {"Don't have an account? "}
              <button
                className="underline underline-offset-2 transition-opacity hover:opacity-70"
                style={{ color: "var(--primary)" }}
              >
                Create one
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs tracking-widest uppercase mb-2"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  color:
                    focused === "email"
                      ? "var(--primary)"
                      : "var(--muted-foreground)",
                  transition: "color 0.2s",
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full px-4 py-3 text-sm outline-none transition-all duration-200"
                style={{
                  background: "var(--input-background)",
                  color: "var(--foreground)",
                  border: `1px solid ${focused === "email" ? "var(--primary)" : "var(--border)"}`,
                  borderRadius: "2px",
                  caretColor: "var(--primary)",
                }}
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label
                  htmlFor="password"
                  className="text-xs tracking-widest uppercase"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    color:
                      focused === "password"
                        ? "var(--primary)"
                        : "var(--muted-foreground)",
                    transition: "color 0.2s",
                  }}
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs underline underline-offset-2 transition-opacity hover:opacity-70"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 text-sm outline-none transition-all duration-200"
                  style={{
                    background: "var(--input-background)",
                    color: "var(--foreground)",
                    border: `1px solid ${focused === "password" ? "var(--primary)" : "var(--border)"}`,
                    borderRadius: "2px",
                    caretColor: "var(--primary)",
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60"
                  style={{ color: "var(--muted-foreground)" }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm tracking-widest uppercase transition-all duration-300 mt-2"
              style={{
                fontFamily: "'DM Mono', monospace",
                background: loading ? "transparent" : "var(--primary)",
                color: loading ? "var(--primary)" : "var(--primary-foreground)",
                border: `1px solid var(--primary)`,
                borderRadius: "2px",
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onClick={onClickHandle}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div
              className="flex-1 h-px"
              style={{ background: "var(--border)" }}
            />
            <span
              className="text-xs tracking-widest uppercase"
              style={{
                fontFamily: "'DM Mono', monospace",
                color: "var(--muted-foreground)",
              }}
            >
              or
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "var(--border)" }}
            />
          </div>

          {/* Social */}
          <button
            type="button"
            className="w-full py-3 text-sm flex items-center justify-center gap-3 transition-all duration-200 hover:opacity-80"
            style={{
              background: "var(--input-background)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              borderRadius: "2px",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
