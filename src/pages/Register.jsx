import { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const submit = async () => {
    try {
      await api.post("/auth/register", form);
      alert("Registered successfully!");
      navigate("/login"); // redirect user to login page
    } catch (err) {
      console.error(err);
      alert("Error registering: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white p-4 rounded shadow mt-20">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
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
      <button className="bg-green-600 text-white p-2 w-full rounded hover:bg-green-700" onClick={submit}>
        Register
      </button>
    </div>
  );
}