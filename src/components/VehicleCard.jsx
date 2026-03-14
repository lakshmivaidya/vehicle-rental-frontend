import { useEffect, useState } from "react";
import { api } from "../api";

export default function VehicleCard({ vehicle, refreshVehicles }) {
  const [reviews, setReviews] = useState([]);

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

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
      {vehicle.image && (
        <img
          src={vehicle.image}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="h-48 w-full object-cover rounded mb-4"
        />
      )}

      <p className="font-semibold text-lg mb-1">
        <span className="text-gray-700">Make:</span> {vehicle.make}
      </p>
      <p className="font-semibold text-lg mb-2">
        <span className="text-gray-700">Model:</span> {vehicle.model}
      </p>

      <p><span className="text-gray-700 font-semibold">Year:</span> {vehicle.year}</p>
      <p><span className="text-gray-700 font-semibold">Category:</span> {vehicle.type}</p>
      <p><span className="text-gray-700 font-semibold">Location:</span> {vehicle.location}</p>
      <p><span className="text-gray-700 font-semibold">Price per day:</span> ${vehicle.pricePerDay}</p>
      <p>
        <span className="text-gray-700 font-semibold">Availability:</span> {vehicle.available ? "Available" : "Not Available"}
      </p>

      <p className="mt-2 text-yellow-500">
        {reviews.length > 0
          ? "★".repeat(Math.round(avgRating)) + "☆".repeat(5 - Math.round(avgRating))
          : "No ratings yet"}
        {reviews.length > 0 && ` (${avgRating})`}
      </p>

      <button
        className="bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700"
        onClick={bookVehicle}
      >
        Book Now
      </button>
    </div>
  );
}