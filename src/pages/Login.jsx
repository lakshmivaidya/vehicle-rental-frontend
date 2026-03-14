import { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [role, setRole] = useState("user"); // Default role
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await api.post("/auth/login", form);

      // Check if role matches
      if (res.data.user.role !== role) {
        alert(`Login failed: Credentials do not match selected role (${role})`);
        return;
      }

      // Save token and user info in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Update App state
      setUser(res.data.user);

      // Show role-based alert
      alert(`Logged in successfully as ${res.data.user.role}`);

      // Redirect to vehicles page
      navigate("/vehicles");
    } catch (err) {
      console.error(err);
      alert("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white p-4 rounded shadow mt-20">
      <h2 className="text-xl font-bold mb-4">Login</h2>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      {/* Role Dropdown */}
      <select
        className="border p-2 w-full mb-2"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button
        className="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700"
        onClick={submit}
      >
        Login
      </button>
    </div>
  );
}