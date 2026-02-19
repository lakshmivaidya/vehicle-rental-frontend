import { useEffect, useState } from "react";
import { api } from "../api";
import RentalHistory from "./RentalHistory";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [filters, setFilters] = useState({ type: "", minPrice: "", maxPrice: "", location: "" });
  const [showHistory, setShowHistory] = useState({}); // track which vehicle history is visible

  const fetchVehicles = async () => {
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.location) params.location = filters.location;

      const res = await api.get("/vehicles", { params });
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchVehicles();
  };

  const toggleHistory = (id) => {
    setShowHistory(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Vehicles</h1>

      {/* Filter form */}
      <form className="mb-4 flex flex-col md:flex-row gap-2" onSubmit={handleFilter}>
        <input
          type="text"
          placeholder="Type (Car, Bike, Auto)"
          className="border p-2 rounded flex-1"
          value={filters.type}
          onChange={e => setFilters({ ...filters, type: e.target.value })}
        />
        <input
          type="number"
          placeholder="Min Price"
          className="border p-2 rounded"
          value={filters.minPrice}
          onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max Price"
          className="border p-2 rounded"
          value={filters.maxPrice}
          onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          className="border p-2 rounded flex-1"
          value={filters.location}
          onChange={e => setFilters({ ...filters, location: e.target.value })}
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Apply Filters
        </button>
      </form>

      {/* Vehicle list */}
      {vehicles.length === 0 ? (
        <p className="text-center mt-10 text-gray-700">No vehicles found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle._id} className="bg-white rounded shadow p-4">
              {/* Vehicle image */}
              {vehicle.image && (
                <img
                  src={vehicle.image}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-48 object-cover mb-2 rounded"
                />
              )}

              {/* Make & Model */}
              <p><strong>Make:</strong> {vehicle.make}</p>
              <p><strong>Model:</strong> {vehicle.model}</p>

              {/* Other details */}
              <p><strong>Year:</strong> {vehicle.year}</p>
              <p><strong>Price per day:</strong> ${vehicle.pricePerDay}</p>
              <p><strong>Availability:</strong> {vehicle.available ? "Available" : "Pending Approval"}</p>

              {/* Toggle Rental History */}
              <button
                className="mt-2 text-blue-600 hover:underline"
                onClick={() => toggleHistory(vehicle._id)}
              >
                {showHistory[vehicle._id] ? "Hide Rental History" : "View Rental History"}
              </button>

              {showHistory[vehicle._id] && <RentalHistory vehicleId={vehicle._id} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}