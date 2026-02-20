import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await api.get("/vehicles");
        setVehicles(res.data);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setError("Failed to fetch vehicles");
      }
    };
    fetchVehicles();
  }, []);

  const handleBook = (vehicleId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    navigate(`/bookings?vehicleId=${vehicleId}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Vehicles</h1>

      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div key={v._id} className="bg-white p-4 rounded shadow">
            <img
              src={v.image}
              alt={v.model}
              className="h-40 w-full object-cover rounded mb-2"
            />

            <p><strong>Make:</strong> {v.make}</p>
            <p><strong>Model:</strong> {v.model}</p>
            <p><strong>Year:</strong> {v.year}</p>
            <p><strong>Price per day:</strong> ${v.pricePerDay}</p>
            <p>
              <strong>Status:</strong>{" "}
              {v.available ? "Available" : "Not available"}
            </p>

            {v.available && (
              <button
                onClick={() => handleBook(v._id)}
                className="bg-green-600 text-white px-3 py-1 rounded mt-2 hover:bg-green-700"
              >
                Book
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}