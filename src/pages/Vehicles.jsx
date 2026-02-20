import { useEffect, useState } from "react";
import { api } from "../api";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await api.get("/vehicles");
      setVehicles(res.data);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (vehicleId) => {
    if (!user) {
      alert("Please login to book a vehicle.");
      return;
    }

    const days = prompt("Enter number of days to book:");
    if (!days || isNaN(days) || Number(days) < 1) {
      alert("Invalid number of days");
      return;
    }

    try {
      const res = await api.post("/bookings", {
        userId: user._id,
        vehicleId,
        days: Number(days),
      });
      alert(`Booked successfully! Total: $${res.data.totalPrice}`);
    } catch (err) {
      console.error("Booking failed:", err);
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  if (loading) return <p>Loading vehicles...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <div
          key={vehicle._id}
          className="bg-white p-4 rounded shadow flex flex-col"
        >
          <img
            src={vehicle.image}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="h-40 w-full object-cover rounded mb-4"
          />
          <h2 className="text-xl font-bold mb-1">
            Make: {vehicle.make} | Model: {vehicle.model}
          </h2>
          <p>Category: {vehicle.category}</p>
          <p>Year: {vehicle.year}</p>
          <p>Location: {vehicle.location}</p>
          <p>Price per day: ${vehicle.pricePerDay}</p>
          <p>
            Availability:{" "}
            {vehicle.available ? "Available" : "Not Available"}
          </p>

          {vehicle.available && user && (
            <button
              className="mt-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              onClick={() => handleBook(vehicle._id)}
            >
              Book
            </button>
          )}
        </div>
      ))}
    </div>
  );
}