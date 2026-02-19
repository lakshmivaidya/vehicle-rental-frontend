import { api } from "../api";
import { useState, useEffect } from "react";

export default function VehicleCard({ vehicle, refreshVehicles }) {
  const [avgRating, setAvgRating] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Fetch average rating & approved reviews
  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/vehicle/${vehicle._id}`);
      if (res.data.length > 0) {
        const total = res.data.reduce((sum, r) => sum + r.rating, 0);
        setAvgRating((total / res.data.length).toFixed(1));
        setReviews(res.data);
      } else {
        setAvgRating(null);
        setReviews([]);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [vehicle._id]);

  const bookVehicle = async () => {
    try {
      const days = prompt("For how many days do you want to rent this vehicle?");
      if (!days || isNaN(days) || Number(days) < 1) {
        alert("Please enter a valid number of days");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Please login first");
        return;
      }

      await api.post("/bookings", {
        userId: user.id || user._id,
        vehicleId: vehicle._id,
        days: Number(days),
      });

      alert(`Vehicle booked successfully for ${days} day(s)!`);
      refreshVehicles();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow flex flex-col">
      {/* Vehicle Image */}
      {vehicle.image && (
        <img
          src={vehicle.image}
          alt={vehicle.make}
          className="h-48 w-full object-cover rounded mb-3"
        />
      )}

      {/* Vehicle Info */}
      <h2 className="font-bold text-lg mb-1">
        {vehicle.make} - {vehicle.model}
      </h2>

      <p className="text-gray-600">
        <strong>Make:</strong> {vehicle.make}
      </p>
      <p className="text-gray-600">
        <strong>Model:</strong> {vehicle.model}
      </p>
      <p className="text-gray-600">
        <strong>Year:</strong> {vehicle.year}
      </p>
      <p className="font-semibold mt-1">
        <strong>Price per day:</strong> ${vehicle.pricePerDay}
      </p>

      {/* Availability */}
      {typeof vehicle.available !== "undefined" && (
        <p
          className={`mt-1 font-semibold ${
            vehicle.available ? "text-green-600" : "text-red-600"
          }`}
        >
          {vehicle.available ? "Available" : "Not Available"}
        </p>
      )}

      {/* Average Rating */}
      {avgRating && (
        <p className="mt-2 text-yellow-600 font-semibold">
          ⭐ {avgRating} / 5
        </p>
      )}

      {/* Display Approved Reviews */}
      {reviews.length > 0 && (
        <div className="mt-2 border-t pt-2">
          <h4 className="font-semibold mb-1">User Reviews</h4>
          <ul className="text-gray-700 max-h-40 overflow-y-auto">
            {reviews.map((r) => (
              <li key={r._id} className="mb-1 border-b py-1">
                <strong>{r.userId?.name}:</strong> {r.comment}{" "}
                <span className="text-yellow-500">({r.rating}/5)</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Book Button */}
      <button
        className="bg-blue-600 text-white p-2 mt-3 rounded hover:bg-blue-700"
        onClick={bookVehicle}
      >
        Book Now
      </button>
    </div>
  );
}