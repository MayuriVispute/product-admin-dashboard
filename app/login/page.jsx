"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { loginUser } from "../../lib/authApi";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    try {
      setLoading(true);

      const result = await loginUser(
        username.trim(),
        password
      );

      localStorage.setItem(
        "accessToken",
        result.accessToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(result)
      );

      router.replace("/dashboard");
    } catch (err) {
      setError(
        err.message || "Invalid username or password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/login-bg.png')",
      }}
    >
      {/* Background overlay */}
      <div className="flex min-h-screen items-center justify-center bg-blue-900/20 px-4 py-8">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
          
          {/* Logo */}
          <div className="mb-5 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-9 w-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 8h12l1 12H5L6 8Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 8a3 3 0 0 1 6 0"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold text-slate-800">
              Product Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Login to continue
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Username */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                placeholder="Enter username"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter password"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}