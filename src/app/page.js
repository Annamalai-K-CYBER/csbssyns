"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/dashboard");
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      if (data?.token) {
        localStorage.setItem("token", data.token);
        if (data?.user?.role) localStorage.setItem("role", data.user.role);
        router.push("/dashboard");
      } else {
        setError("No token received from server");
      }
    } catch {
      setError("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-800 via-purple-700 to-pink-600 px-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-10 border border-white/20 animate-fadeIn">
        <h1 className="text-5xl font-extrabold text-center mb-2 text-white drop-shadow-lg">
          CSBS Sync
        </h1>
        <p className="text-center text-white/80 mb-10 text-lg">
          Stay connected. Learn. Collaborate. 🚀
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium mb-2 text-white/90">
              Id
            </label>
            <input
              type="email"
              placeholder="Enter your Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-2 text-white/90">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200"
            />
          </div>

          {error && (
            <p className="text-red-400 text-center font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-semibold rounded-xl hover:scale-105 transform transition duration-300 shadow-md disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <footer className="mt-8 text-center text-xs text-white/60">
          © {new Date().getFullYear()} CSBS Sync | Built with ❤️ by Students
        </footer>
      </div>
    </div>
  );
}
