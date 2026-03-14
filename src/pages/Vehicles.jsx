import { useEffect, useState } from "react";
import { api } from "../api";
import VehicleCard from "../components/VehicleCard";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    minPrice: "",
    maxPrice: "",
  });

  const fetchVehicles = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await api.get(`/vehicles?${query}`);
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Available Vehicles</h1>

      {/* FILTER SECTION */}
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          name="category"
          placeholder="Category (Auto, Car, Bike...)"
          className="border p-2 rounded"
          onChange={handleChange}
        />
        <input
          name="location"
          placeholder="Location"
          className="border p-2 rounded"
          onChange={handleChange}
        />
        <input
          name="minPrice"
          type="number"
          placeholder="Min Price"
          className="border p-2 rounded"
          onChange={handleChange}
        />
        <input
          name="maxPrice"
          type="number"
          placeholder="Max Price"
          className="border p-2 rounded"
          onChange={handleChange}
        />
        <button
          onClick={fetchVehicles}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 md:col-span-4"
        >
          Apply Filters
        </button>
      </div>

      {/* VEHICLE GRID */}
      {vehicles.length === 0 ? (
        <p>No vehicles found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              refreshVehicles={fetchVehicles}
            />
          ))}
        </div>
      )}
    </div>
  );
}