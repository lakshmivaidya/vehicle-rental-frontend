import { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await api.post("/auth/login", form);

      const loggedUser = res.data.user;

      if (loggedUser.role !== role) {
        if (role === "user" && loggedUser.role === "admin") {
          alert("Admin credentials cannot be used for User login");
        } else if (role === "admin" && loggedUser.role === "user") {
          alert("User credentials cannot be used for Admin login");
        } else {
          alert("Role mismatch");
        }
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      setUser(loggedUser);

      if (loggedUser.role === "admin") {
        alert("Logged in successfully as Admin");
      } else {
        alert("Logged in successfully as User");
      }

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-br from-[#EEF2FF] via-[#F8FAFC] to-[#E0F2FE]" />

      
      <div className="absolute w-[600px] h-[600px] bg-indigo-300/30 rounded-full blur-[140px] -top-48 -left-48 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-sky-300/30 rounded-full blur-[140px] bottom-0 right-0 pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-purple-200/30 rounded-full blur-[120px] top-1/2 left-1/3 pointer-events-none" />

      
      <div className="relative w-full max-w-5xl flex bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 z-10">

        
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white items-center justify-center p-12">

          <div className="text-center max-w-sm">

            <div className="mb-8 flex justify-center">
              <img
                src="/car.jpg"
                alt="car"
                className="w-32 drop-shadow-2xl"
              />
            </div>

            <h1 className="text-3xl font-semibold mb-3">
              Welcome Back
            </h1>

            <p className="text-gray-300 text-sm leading-relaxed">
              Book rides instantly with trusted drivers at transparent pricing.
            </p>

            <p className="mt-6 text-xs text-gray-400">
              Safe • Reliable • Fast Booking
            </p>
          </div>
        </div>

        
        <div className="w-full md:w-1/2 p-10">

          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Sign in to continue
          </h2>

          
          <div className="mb-5">
            <label className="text-sm text-gray-600">Email</label>
            <input
              className="w-full mt-1 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter email"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          
          <div className="mb-5">
            <label className="text-sm text-gray-600">Password</label>

            <div className="relative mt-1">
              <input
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black pr-12"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-xs text-gray-500 hover:text-black"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          
          <div className="mb-7">
            <label className="text-sm text-gray-600">Login as</label>
            <select
              className="w-full mt-1 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          
          <button
            onClick={submit}
            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-900 transition active:scale-95"
          >
            Login
          </button>

        </div>
      </div>
    </div>
  );
}