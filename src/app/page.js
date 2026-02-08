// "use client";

// export default function Home() {
//   return (
//     <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">

//       {/* Colorful Animated Background */}
//       <div className="absolute inset-0 bg-gradient-to-r from-pink-600/40 via-purple-700/40 to-blue-600/40 blur-3xl opacity-70 animate-bgMove"></div>

//       {/* Glow Lights */}
//       <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/40 blur-[120px] rounded-full"></div>
//       <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-500/40 blur-[120px] rounded-full"></div>

//       {/* Main Card */}
//       <div className="relative z-10 w-full max-w-3xl mx-auto px-6 md:px-10 py-14 bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 animate-fade-in">

//         {/* Highlighted COMING SOON */}
//         <div className="text-center mb-4">
//           <span className="px-5 py-2 text-sm md:text-base font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg animate-pulse">
//             🚀 COMING SOON
//           </span>
//         </div>

//         <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-6 drop-shadow-xl">
//           CSBS <span className="text-cyan-400">Sync</span>
//         </h1>

//         {/* Highlighted “Building Something Powerful” */}
//         <p className="text-center text-gray-200 mb-10 text-lg md:text-2xl font-semibold leading-relaxed max-w-2xl mx-auto">
//           We are <span className="text-cyan-300">building something powerful</span> —  
//           a next-generation platform designed for speed, intelligence, and seamless syncing.
//         </p>

//         <p className="text-center text-gray-300 mb-10 text-md md:text-lg leading-relaxed max-w-2xl mx-auto">
//           Our new system is under development and will soon migrate to an upgraded domain.
//           Stay tuned for something game-changing.
//         </p>

//         {/* Feature Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
//           <FeatureCard title="Fast Sync" icon="⚡" color="from-yellow-400 to-orange-500" />
//           <FeatureCard title="Smart Tools" icon="💡" color="from-green-400 to-emerald-500" />
//           <FeatureCard title="New Domain" icon="🌐" color="from-blue-400 to-cyan-500" />
//         </div>

//         <p className="text-center text-gray-400 text-sm">
//           © {new Date().getFullYear()} CSBS Sync — All rights reserved.
//         </p>
//       </div>
//     </main>
//   );
// }


// // Feature Card Component
// function FeatureCard({ title, icon, color }) {
//   return (
//     <div className="p-6 bg-white/10 rounded-2xl border border-white/20 text-center shadow-xl hover:scale-[1.06] hover:bg-white/20 transition-all cursor-pointer backdrop-blur-xl">
//       <div className={`text-4xl mb-3 bg-gradient-to-br ${color} text-transparent bg-clip-text drop-shadow-lg`}>
//         {icon}
//       </div>
//       <p className="text-gray-100 font-semibold text-lg">{title}</p>
//     </div>
//   );
// }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl w-full max-w-md p-10 border border-gray-200 animate-fadeIn">
        <h1 className="text-4xl font-extrabold text-center mb-2 text-gray-800">
          CSBS SYNC
        </h1>
        <p className="text-center text-gray-500 mb-10 text-lg">
          Stay connected. Learn. Collaborate. 🚀
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Id
            </label>
            <input
              type="email"
              placeholder="Enter your Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200 bg-white"
            />
          </div>

          {error && (
            <p className="text-red-500 text-center font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 font-semibold rounded-xl hover:scale-105 transform transition duration-300 shadow-md disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <footer className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} CSBS SYNC | Built with ❤️ by Students
        </footer>
      </div>
    </div>
  );
}
