import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";

import Vehicles from "./pages/Vehicles";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bookings from "./pages/Bookings";
import AdminDashboard from "./pages/AdminDashboard";
import ListVehicle from "./pages/ListVehicle";
import Profile from "./pages/Profile";
import AnimatedBackground from "./components/AnimatedBackground";

import { Toaster } from "react-hot-toast";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const AuthRedirect = ({ children }) => {
    if (loading) return null;

    if (user) {
      return (
        <Navigate
          to={user.role === "admin" ? "/admin" : "/"}
        />
      );
    }

    return children;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <AnimatedBackground />

      <div className="min-h-screen relative text-gray-800">
        <nav className="bg-white/90 backdrop-blur-md border-b shadow-sm px-6 py-3 flex justify-between items-center">
          <div className="flex gap-6 items-center font-medium text-sm">
            {user?.role === "admin" ? (
              <Link
                to="/admin"
                className="hover:text-blue-600 transition"
              >
                Admin Dashboard
              </Link>
            ) : user ? (
              <>
                <Link
                  to="/"
                  className="hover:text-blue-600 transition"
                >
                  Vehicles
                </Link>
                <Link
                  to="/bookings"
                  className="hover:text-blue-600 transition"
                >
                  Bookings
                </Link>
                <Link
                  to="/list-vehicle"
                  className="hover:text-blue-600 transition"
                >
                  List Vehicle
                </Link>
                <Link
                  to="/profile"
                  className="hover:text-blue-600 transition"
                >
                  Profile
                </Link>
              </>
            ) : null}

            {!user && (
              <>
                <Link
                  to="/login"
                  className="hover:text-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hover:text-blue-600 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-600">
                Logged in as{" "}
                <b className="text-gray-900">
                  {user.name ? user.name : user.email}
                </b>
              </span>
            )}

            {user && (
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded
                           text-white text-sm transition transform
                           hover:scale-105 active:scale-95 shadow-md"
              >
                Logout
              </button>
            )}
          </div>
        </nav>

        <div className="p-6">
          <Routes>
            <Route
              path="/"
              element={
                user && user.role !== "admin" ? (
                  <Vehicles user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/bookings"
              element={
                user ? (
                  <Bookings user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/list-vehicle"
              element={
                user ? (
                  <ListVehicle user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/profile"
              element={
                user ? (
                  <Profile user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/admin"
              element={
                user?.role === "admin" ? (
                  <AdminDashboard user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/login"
              element={
                <AuthRedirect>
                  <Login setUser={setUser} />
                </AuthRedirect>
              }
            />

            <Route
              path="/register"
              element={
                <AuthRedirect>
                  <Register />
                </AuthRedirect>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}