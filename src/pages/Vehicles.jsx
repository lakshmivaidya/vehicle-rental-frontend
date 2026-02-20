import { useEffect, useState } from "react";
import { api } from "../api";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await api.get("/vehicles");
        setVehicles(res.data);
      } catch (err) {
        setError("Failed to fetch vehicles");
        console.error("Vehicles fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const handleBook = (vehicleId) => {
    // Store vehicle ID in localStorage and navigate to booking page
    localStorage.setItem("selectedVehicleId", vehicleId);
    window.location.href = "/bookings";
  };

  if (loading) return <p className="p-6">Loading vehicles...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((v) => (
        <div key={v._id} className="border rounded shadow p-4 flex flex-col">
          <img
            src={v.image}
            alt={`${v.make} ${v.model}`}
            className="h-40 w-full object-cover rounded mb-3"
          />
          <h2 className="font-bold text-lg mb-1">{v.make} - {v.model}</h2>
          <p>Category: {v.category}</p>
          <p>Year: {v.year}</p>
          <p>Location: {v.location}</p>
          <p>Price per day: ${v.pricePerDay}</p>
          <p>Availability: {v.available ? "Available" : "Not Available"}</p>
          {v.available && (
            <button
              onClick={() => handleBook(v._id)}
              className="mt-2 bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              Book
            </button>
          )}
        </div>
      ))}
    </div>
  );
}