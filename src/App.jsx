import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Vehicles from "./pages/Vehicles";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bookings from "./pages/Bookings";
import AdminDashboard from "./pages/AdminDashboard";
import ListVehicle from "./pages/ListVehicle"; // NEW

export default function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage on page load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    alert("Logged out successfully");
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow p-4 flex gap-4 justify-between items-center">
          <div className="flex gap-4">
            <Link className="hover:underline" to="/">
              Vehicles
            </Link>
            <Link className="hover:underline" to="/bookings">
              Bookings
            </Link>

            {/* Show only if user is logged in */}
            {user && (
              <Link className="hover:underline" to="/list-vehicle">
                List Vehicle
              </Link>
            )}

            {user?.role === "admin" && (
              <Link className="hover:underline" to="/admin">
                Admin Dashboard
              </Link>
            )}

            {!user && (
              <>
                <Link className="hover:underline" to="/login">
                  Login
                </Link>
                <Link className="hover:underline" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>

          {user && (
            <div className="flex gap-2 items-center">
              <span className="font-semibold text-gray-700">
                Logged in as {user.role}
              </span>
              <button
                className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          )}
        </nav>

        {/* Page content */}
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Vehicles user={user} />} />
            <Route path="/bookings" element={<Bookings user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/list-vehicle"
              element={
                user ? (
                  <ListVehicle />
                ) : (
                  <p className="text-red-600 font-semibold">Please login to list a vehicle</p>
                )
              }
            />
            <Route
              path="/admin"
              element={user?.role === "admin" ? <AdminDashboard /> : <p>Access Denied</p>}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}