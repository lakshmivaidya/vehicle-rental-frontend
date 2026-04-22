import { useState, useEffect } from "react";
import { api } from "../api";
import toast, { Toaster } from "react-hot-toast";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored) {
      setUser(stored);
      setName(stored.name || "");
      setEmail(stored.email || "");
    }
  }, []);

  const updateProfile = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await api.put("/auth/update", {
        userId: user._id,
        name,
        email,
      });

      const updatedUser = res.data.user;

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success("Profile updated successfully ✅");

      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">

      <Toaster position="top-right" />

      {/* BACKGROUND GLOW */}
      <div className="absolute w-72 h-72 bg-blue-400 opacity-30 blur-3xl rounded-full top-10 left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-purple-400 opacity-30 blur-3xl rounded-full bottom-10 right-10 animate-pulse"></div>

      {/* PROFILE CARD */}
      <div className="relative w-full max-w-md bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/30 transition-all duration-300 hover:scale-[1.02]">

        {/* AVATAR */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
            {name ? name.charAt(0).toUpperCase() : "U"}
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800 tracking-wide">
          Your Profile
        </h2>

        {/* INPUTS */}
        <div className="space-y-4">
          <input
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />

          <input
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>

        {/* BUTTON (UNIFIED "LIVE CLICK" STYLE) */}
        <button
          onClick={updateProfile}
          disabled={loading}
          className={`
            w-full mt-6 py-3 rounded-lg text-white font-semibold
            transition-all duration-200 transform active:scale-95
            ${
              loading
                ? "bg-gray-400"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 hover:shadow-xl"
            }
          `}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>

      </div>
    </div>
  );
}