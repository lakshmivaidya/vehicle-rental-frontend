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

  // Component to redirect logged-in users away from login/register
  const AuthRedirect = ({ children }) => {
    if (user) {
      return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;
    }
    return children;
  };

  return (
    <Router>
      {/* Full app background */}
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
        {/* Navigation */}
        <nav className="bg-white shadow p-4 flex gap-4 justify-between items-center">
          <div className="flex gap-4">
            {user?.role === "admin" ? (
              <Link className="hover:text-blue-600 font-semibold" to="/admin">
                Admin Dashboard
              </Link>
            ) : (
              <>
                {user && (
                  <Link className="hover:text-blue-600 font-semibold" to="/">
                    Vehicles
                  </Link>
                )}
                {user && (
                  <Link className="hover:text-blue-600 font-semibold" to="/bookings">
                    My Bookings
                  </Link>
                )}
                {user && (
                  <Link className="hover:text-blue-600 font-semibold" to="/list-vehicle">
                    List Vehicle
                  </Link>
                )}
              </>
            )}
            {!user && (
              <>
                <Link className="hover:text-blue-600 font-semibold" to="/login">
                  Login
                </Link>
                <Link className="hover:text-blue-600 font-semibold" to="/register">
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
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
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
            <Route
              path="/"
              element={user && user.role !== "admin" ? <Vehicles user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/bookings"
              element={user && user.role !== "admin" ? <Bookings user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/list-vehicle"
              element={user && user.role !== "admin" ? <ListVehicle /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin"
              element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={<AuthRedirect><Login setUser={setUser} /></AuthRedirect>}
            />
            <Route
              path="/register"
              element={<AuthRedirect><Register /></AuthRedirect>}
            />
            <Route
              path="*"
              element={<Navigate to={user ? (user.role === "admin" ? "/admin" : "/") : "/login"} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}