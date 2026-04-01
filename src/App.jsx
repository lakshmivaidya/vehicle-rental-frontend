import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Vehicles from "./pages/Vehicles";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bookings from "./pages/Bookings";
import AdminDashboard from "./pages/AdminDashboard";
import ListVehicle from "./pages/ListVehicle";

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
            {/* Show Vehicles only if logged in */}
            {user && (
              <Link className="hover:underline" to="/">
                Vehicles
              </Link>
            )}

            {/* Show Bookings only if logged in */}
            {user && (
              <Link className="hover:underline" to="/bookings">
                My Bookings
              </Link>
            )}

            {/* Show List Vehicle only if logged in */}
            {user && (
              <Link className="hover:underline" to="/list-vehicle">
                List Vehicle
              </Link>
            )}

            {/* Show Admin Dashboard only if admin */}
            {user?.role === "admin" && (
              <Link className="hover:underline" to="/admin">
                Admin Dashboard
              </Link>
            )}

            {/* Show Login/Register only if NOT logged in */}
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

          {/* User info and logout */}
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

        {/* Page Content */}
        <div className="p-6">
          <Routes>
            {/* Home / Vehicles */}
            <Route
              path="/"
              element={user ? <Vehicles user={user} /> : <Navigate to="/login" />}
            />

            {/* Bookings */}
            <Route
              path="/bookings"
              element={user ? <Bookings user={user} /> : <Navigate to="/login" />}
            />

            {/* List Vehicle */}
            <Route
              path="/list-vehicle"
              element={user ? <ListVehicle /> : <Navigate to="/login" />}
            />

            {/* Admin Dashboard */}
            <Route
              path="/admin"
              element={
                user?.role === "admin" ? (
                  <AdminDashboard />
                ) : (
                  <p className="text-red-600 font-semibold">Access Denied</p>
                )
              }
            />

            {/* Login */}
            <Route path="/login" element={<Login setUser={setUser} />} />

            {/* Register */}
            <Route path="/register" element={<Register />} />

            {/* Catch-all: redirect unknown routes */}
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}