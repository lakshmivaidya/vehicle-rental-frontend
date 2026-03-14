import { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  const fetchData = async () => {
    try {
      const v = await api.get("/vehicles");
      const u = await api.get("/auth/users");
      const b = await api.get("/bookings");

      setVehicles(v.data);
      setUsers(u.data);
      setBookings(b.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getPaymentStatus = (status) => {
    // Show Paid for all completed/paid bookings
    if (status === "paid" || status === "completed") {
      return (
        <span className="text-green-600 font-semibold">
          Paid
        </span>
      );
    }
    if (status === "booked") {
      return (
        <span className="text-red-600 font-semibold">
          Not Paid
        </span>
      );
    }
    if (status === "cancelled") {
      return (
        <span className="text-gray-600 font-semibold">
          Cancelled
        </span>
      );
    }
    return status;
  };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Admin Dashboard
      </h1>

      {/* VEHICLES */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">
          Vehicles
        </h2>
        <table className="w-full border">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">Make</th>
              <th className="p-3">Model</th>
              <th className="p-3">Year</th>
              <th className="p-3">Type</th>
              <th className="p-3">Location</th>
              <th className="p-3">Price/Day</th>
              <th className="p-3">Available</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v._id} className="border-b hover:bg-gray-100">
                <td className="p-3">{v.make}</td>
                <td className="p-3">{v.model}</td>
                <td className="p-3">{v.year}</td>
                <td className="p-3">{v.category}</td>
                <td className="p-3">{v.location}</td>
                <td className="p-3">${v.pricePerDay}</td>
                <td className="p-3">{v.available ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* USERS */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-green-700">
          Users
        </h2>
        <table className="w-full border">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b hover:bg-gray-100">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BOOKINGS */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">
          Bookings
        </h2>
        <table className="w-full border">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">Start</th>
              <th className="p-3">End</th>
              <th className="p-3">Total</th>
              <th className="p-3">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-b hover:bg-gray-100">
                <td className="p-3">{b.userId?.name}</td>
                <td className="p-3">{b.vehicleId?.make} {b.vehicleId?.model}</td>
                <td className="p-3">{new Date(b.startDate).toLocaleDateString()}</td>
                <td className="p-3">{new Date(b.endDate).toLocaleDateString()}</td>
                <td className="p-3">${b.totalPrice}</td>
                <td className="p-3">{getPaymentStatus(b.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}