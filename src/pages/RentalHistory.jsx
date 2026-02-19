import { useEffect, useState } from "react";
import { api } from "../api";

export default function RentalHistory({ vehicleId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/bookings/history/${vehicleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch rental history:", err);
        setHistory([]); // clear old data
      }
    };

    fetchHistory();
  }, [vehicleId]);

  if (history.length === 0) return <p className="text-gray-500 text-sm mt-2">No rental history yet.</p>;

  return (
    <div className="mt-2 border-t pt-2">
      <h3 className="font-semibold text-sm mb-1">Rental History</h3>
      <ul className="text-sm text-gray-700">
        {history.map((b) => (
          <li key={b._id}>
            {b.userName} ({b.userEmail}) → {new Date(b.startDate).toLocaleDateString()} -{" "}
            {new Date(b.endDate).toLocaleDateString()} | {b.status} | Total: ${b.totalPrice}
          </li>
        ))}
      </ul>
    </div>
  );
}