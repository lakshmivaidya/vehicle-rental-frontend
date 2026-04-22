import { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleHistory, setVehicleHistory] = useState([]);

  // =======================
  // FETCH ALL DATA
  // =======================
  const fetchData = async () => {
    try {
      const [v, u, b] = await Promise.all([
        api.get("/vehicles"),
        api.get("/auth/users"),
        api.get("/bookings"),
      ]);

      setVehicles(v.data);
      setUsers(u.data);
      setBookings(b.data);
    } catch (err) {
      console.error("FETCH DATA ERROR:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =======================
  // VEHICLE HISTORY
  // =======================
  const fetchVehicleHistory = async (vehicle) => {
    if (!vehicle?._id) return;

    try {
      const res = await api.get(`/bookings/vehicle/${vehicle._id}/history`);
      setSelectedVehicle(vehicle);
      setVehicleHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const closeModal = () => {
    setSelectedVehicle(null);
    setVehicleHistory([]);
  };

  // =======================
  // STATUS UI
  // =======================
  const getStatus = (status) => {
    if (status === "paid" || status === "completed") {
      return <span className="text-green-600 font-semibold">Completed</span>;
    }
    if (status === "booked") {
      return <span className="text-yellow-600 font-semibold">Booked</span>;
    }
    if (status === "cancelled") {
      return <span className="text-gray-500 font-semibold">Cancelled</span>;
    }
    return status;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* ================= VEHICLES ================= */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          Vehicles
        </h2>

        <table className="w-full border">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2 text-left">Make</th>
              <th className="p-2 text-left">Model</th>
              <th className="p-2 text-left">Year</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Location</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Available</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((v) => (
              <tr key={v._id} className="border-b">
                <td className="p-2">{v.make}</td>
                <td className="p-2">{v.model}</td>
                <td className="p-2">{v.year}</td>
                <td className="p-2">{v.type}</td>
                <td className="p-2">{v.location}</td>
                <td className="p-2">${v.pricePerDay}</td>
                <td className="p-2">{v.available ? "Yes" : "No"}</td>

                <td className="p-2">
                  <button
                    onClick={() => fetchVehicleHistory(v)}
                    className="bg-purple-600 text-white px-4 py-1.5 rounded
                               transition transform active:scale-95 hover:scale-105
                               hover:bg-purple-700 shadow-sm"
                  >
                    View History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= USERS ================= */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-green-600">
          Users
        </h2>

        <table className="w-full border">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Created</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= BOOKINGS ================= */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-purple-600">
          Bookings
        </h2>

        <table className="w-full border">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Vehicle</th>
              <th className="p-2 text-left">Start</th>
              <th className="p-2 text-left">End</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Review</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-b">
                <td className="p-2">{b.userId?.name}</td>
                <td className="p-2">
                  {b.vehicleId?.make} {b.vehicleId?.model}
                </td>
                <td className="p-2">
                  {new Date(b.startDate).toLocaleDateString()}
                </td>
                <td className="p-2">
                  {new Date(b.endDate).toLocaleDateString()}
                </td>
                <td className="p-2">${b.totalPrice}</td>
                <td className="p-2">{getStatus(b.status)}</td>

                {/* ⭐ REVIEW COLUMN */}
                <td className="p-2">
                  {b.review?.rating ? (
                    <div className="bg-gray-100 p-2 rounded">
                      <p className="text-yellow-600 font-semibold">
                        ⭐ {b.review.rating}/5
                      </p>
                      <p className="text-sm text-gray-700">
                        {b.review.comment}
                      </p>
                    </div>
                  ) : (
                    <span className="text-gray-400">No review</span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= VEHICLE HISTORY MODAL ================= */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl p-6 rounded shadow-lg max-h-[80vh] overflow-auto">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                History - {selectedVehicle.make} {selectedVehicle.model}
              </h2>

              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-3 py-1 rounded
                           transition transform active:scale-95 hover:scale-105
                           hover:bg-red-600"
              >
                Close
              </button>
            </div>

            {vehicleHistory.length === 0 ? (
              <p>No bookings found for this vehicle.</p>
            ) : (
              <table className="w-full border">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 text-left">User</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Start</th>
                    <th className="p-2 text-left">End</th>
                    <th className="p-2 text-left">Days</th>
                    <th className="p-2 text-left">Total</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Review</th>
                  </tr>
                </thead>

                <tbody>
                  {vehicleHistory.map((b) => (
                    <tr key={b._id} className="border-b">
                      <td className="p-2">{b.user?.name}</td>
                      <td className="p-2">{b.user?.email}</td>
                      <td className="p-2">
                        {new Date(b.startDate).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        {new Date(b.endDate).toLocaleDateString()}
                      </td>
                      <td className="p-2">{b.days}</td>
                      <td className="p-2">${b.totalPrice}</td>
                      <td className="p-2">{getStatus(b.status)}</td>

                      {/* ⭐ REVIEW COLUMN */}
                      <td className="p-2">
                        {b.review?.rating ? (
                          <div className="bg-gray-100 p-2 rounded">
                            <p className="text-yellow-600 font-semibold">
                              ⭐ {b.review.rating}/5
                            </p>
                            <p className="text-sm text-gray-700">
                              {b.review.comment}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400">No review</span>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </div>
        </div>
      )}

    </div>
  );
}