import { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const [uRes, vRes, bRes, rRes] = await Promise.all([
        api.get("/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/admin/vehicles", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/admin/bookings", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/admin/reviews", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setUsers(uRes.data);
      setVehicles(vRes.data);
      setBookings(bRes.data);
      setReviews(rRes.data.filter(r => !r.approved)); // pending reviews
    } catch (err) {
      console.error(err);
      alert("Failed to fetch admin data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approveVehicle = async (id) => {
    await api.post(`/admin/vehicles/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };

  const rejectVehicle = async (id) => {
    await api.post(`/admin/vehicles/${id}/reject`, {}, { headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };

  const approveReview = async (id) => {
    await api.post(`/admin/reviews/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Users */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Users</h2>
        <ul className="border p-2 rounded">
          {users.map(u => (
            <li key={u._id}>{u.name} ({u.email}) - Role: {u.role}</li>
          ))}
        </ul>
      </div>

      {/* Vehicles */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Vehicles</h2>
        <ul className="border p-2 rounded">
          {vehicles.map(v => (
            <li key={v._id} className="mb-2 flex justify-between items-center">
              {v.make} {v.model} - {v.available ? "Available" : "Pending Approval"}
              {!v.available && (
                <div className="flex gap-2">
                  <button className="bg-green-600 text-white p-1 rounded" onClick={() => approveVehicle(v._id)}>Approve</button>
                  <button className="bg-red-600 text-white p-1 rounded" onClick={() => rejectVehicle(v._id)}>Reject</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Bookings */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Bookings</h2>
        <ul className="border p-2 rounded">
          {bookings.map(b => (
            <li key={b._id}>
              {b.userId?.name} booked {b.vehicleId?.make} {b.vehicleId?.model} - Status: {b.status} - Paid: {b.paid ? "Yes" : "No"}
            </li>
          ))}
        </ul>
      </div>

      {/* Reviews */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Pending Reviews</h2>
        <ul className="border p-2 rounded">
          {reviews.map(r => (
            <li key={r._id} className="flex justify-between items-center mb-2">
              {r.userId?.name}: {r.comment} ({r.rating}/5)
              <button className="bg-green-600 text-white p-1 rounded" onClick={() => approveReview(r._id)}>Approve</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}