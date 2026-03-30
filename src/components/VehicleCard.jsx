import { useEffect, useState } from "react";
import { api } from "../api";
import toast, { Toaster } from "react-hot-toast";

export default function VehicleCard({ vehicle, refreshVehicles }) {
  const [reviews, setReviews] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/${vehicle._id}`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [vehicle._id]);

  const bookVehicle = async () => {
    if (loading) return; // 🚫 prevent double click

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user._id) {
      toast.error("Please login first");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select both dates");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      toast.error("End date cannot be before start date");
      return;
    }

    try {
      setLoading(true);

      await api.post("/bookings", {
        userId: user._id,
        vehicleId: vehicle._id,
        startDate,
        endDate,
      });

      toast.success("Booking successful ✅");

      setStartDate("");
      setEndDate("");
      refreshVehicles();
    } catch (err) {
      console.error(err);

      // ✅ Only ONE error message
      toast.error(err.response?.data?.message || "Booking failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
      <Toaster position="top-right" />

      {vehicle.image && (
        <img
          src={vehicle.image}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="h-48 w-full object-cover rounded mb-4"
        />
      )}

      <p><b>{vehicle.make} {vehicle.model}</b></p>
      <p>Year: {vehicle.year}</p>
      <p>Type: {vehicle.type}</p>
      <p>Location: {vehicle.location}</p>
      <p>Price: ${vehicle.pricePerDay}</p>

      <p className="mt-2 text-yellow-500">
        {reviews.length > 0
          ? "★".repeat(Math.round(avgRating))
          : "No ratings"}
      </p>

      <div className="mt-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 mb-2 w-full"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <button
        onClick={bookVehicle}
        disabled={loading}
        className={`p-2 mt-4 rounded text-white ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Booking..." : "Book Now"}
      </button>
    </div>
  );
}