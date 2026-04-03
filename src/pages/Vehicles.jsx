import { useEffect, useState } from "react";
import { api } from "../api";
import VehicleCard from "../components/VehicleCard";

export default function Vehicles({ user }) {
  const [vehicles, setVehicles] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    minPrice: "",
    maxPrice: "",
  });

  const fetchVehicles = async () => {
    try {
      // Build filtered query params, ignore empty values and trim strings
      const queryParams = {};
      if (filters.category.trim()) queryParams.category = filters.category.trim();
      if (filters.location.trim()) queryParams.location = filters.location.trim();
      if (filters.minPrice !== "") queryParams.minPrice = filters.minPrice;
      if (filters.maxPrice !== "") queryParams.maxPrice = filters.maxPrice;

      const query = new URLSearchParams(queryParams).toString();
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800 text-center">
        Available Vehicles
      </h1>

      {/* FILTER SECTION */}
      <div className="bg-white shadow-md rounded-lg p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          name="category"
          placeholder="Category (Car, Bike, SUV...)"
          className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
          onChange={handleChange}
          value={filters.category}
        />
        <input
          name="location"
          placeholder="Location"
          className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
          onChange={handleChange}
          value={filters.location}
        />
        <input
          name="minPrice"
          type="number"
          placeholder="Min Price"
          className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
          onChange={handleChange}
          value={filters.minPrice}
          min="0"
        />
        <input
          name="maxPrice"
          type="number"
          placeholder="Max Price"
          className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
          onChange={handleChange}
          value={filters.maxPrice}
          min="0"
        />
        <button
          onClick={fetchVehicles}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors duration-200 md:col-span-4"
        >
          Apply Filters
        </button>
      </div>

      {/* VEHICLE GRID */}
      {vehicles.length === 0 ? (
        <p className="text-center text-gray-600 text-lg mt-6">
          No vehicles found.
        </p>
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