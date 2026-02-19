import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Vehicles from "./pages/Vehicles";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bookings from "./pages/Bookings";
import AdminDashboard from "./pages/AdminDashboard";

function Navigation() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload(); // refresh UI
  };

  return (
    <nav className="bg-white shadow p-4 flex gap-4 items-center">
      <Link className="hover:underline" to="/">Vehicles</Link>
      <Link className="hover:underline" to="/bookings">Bookings</Link>

      {!user && (
        <>
          <Link className="hover:underline" to="/login">Login</Link>
          <Link className="hover:underline" to="/register">Register</Link>
        </>
      )}

      {user?.role === "admin" && (
        <Link className="hover:underline" to="/admin">Admin</Link>
      )}

      {user && (
        <>
          <span className="ml-auto font-semibold">
            {user.name} ({user.role})
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />

        <div className="p-6">
          <Routes>
            <Route path="/" element={<Vehicles />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}