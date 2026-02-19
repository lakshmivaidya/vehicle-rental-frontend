import { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", role: "user" });
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await api.post("/auth/login", form);
      
      // Save token and user info in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert(`Logged in successfully as ${res.data.user.role}!`);

      // Redirect based on role
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/vehicles");
      }
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
        onChange={e => setForm({ ...form, email: e.target.value })}
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
      />

      <select
        className="border p-2 w-full mb-2"
        value={form.role}
        onChange={e => setForm({ ...form, role: e.target.value })}
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