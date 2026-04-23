import { useEffect, useState, useCallback } from "react";
import { api } from "../api";
import VehicleCard from "../components/VehicleCard";

export default function Vehicles({ user }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    category: "",
    location: "",
    minPrice: "",
    maxPrice: "",
  });

  // =========================
  // FETCH VEHICLES (FIXED)
  // =========================
  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);

      const params = {};

      if (filters.category?.trim()) {
        params.category = filters.category.trim();
      }

      if (filters.location?.trim()) {
        params.location = filters.location.trim();
      }

      if (filters.minPrice !== "") {
        params.minPrice = filters.minPrice;
      }

      if (filters.maxPrice !== "") {
        params.maxPrice = filters.maxPrice;
      }

      // ✅ IMPORTANT FIX: avoid calling /vehicles?
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/vehicles?${queryString}` : "/vehicles";

      const res = await api.get(url);

      setVehicles(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch vehicles error:", err);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // =========================
  // FILTER CHANGE
  // =========================
  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // CLEAR FILTERS
  // =========================
  const clearFilters = () => {
    setFilters({
      category: "",
      location: "",
      minPrice: "",
      maxPrice: "",
    });

    setTimeout(() => {
      fetchVehicles();
    }, 0);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">

      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
        Available Vehicles
      </h1>

      {/* FILTER PANEL */}
      <div className="backdrop-blur-md bg-white/70 border border-white/40 shadow-xl rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">

        <input
          name="category"
          placeholder="Category (Car, Bike, SUV...)"
          className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400"
          onChange={handleChange}
          value={filters.category}
        />

        <input
          name="location"
          placeholder="Location"
          className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400"
          onChange={handleChange}
          value={filters.location}
        />

        <input
          name="minPrice"
          type="number"
          placeholder="Min Price"
          className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400"
          onChange={handleChange}
          value={filters.minPrice}
        />

        <input
          name="maxPrice"
          type="number"
          placeholder="Max Price"
          className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400"
          onChange={handleChange}
          value={filters.maxPrice}
        />

        {/* BUTTONS */}
        <div className="md:col-span-4 flex flex-col sm:flex-row gap-3 justify-center mt-2">

          <button
            onClick={fetchVehicles}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold
                       transition transform active:scale-95 hover:scale-105
                       hover:bg-blue-700 shadow-md disabled:opacity-60"
          >
            {loading ? "Loading..." : "Apply Filters"}
          </button>

          <button
            onClick={clearFilters}
            className="bg-gray-500 text-white px-6 py-2 rounded-xl font-semibold
                       transition transform active:scale-95 hover:scale-105
                       hover:bg-gray-600 shadow-md"
          >
            Reset
          </button>
        </div>
      </div>

      {/* VEHICLE GRID */}
      {loading ? (
        <p className="text-center text-gray-600 text-lg mt-6">
          Loading vehicles...
        </p>
      ) : vehicles.length === 0 ? (
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