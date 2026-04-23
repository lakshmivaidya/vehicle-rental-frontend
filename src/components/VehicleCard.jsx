import { useEffect, useState, useRef } from "react";
import { api } from "../api";
import toast from "react-hot-toast";

const FALLBACK_IMAGE = "https://via.placeholder.com/300";

export default function VehicleCard({ vehicle, refreshVehicles }) {
  const [reviews, setReviews] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isBookingRef = useRef(false);

  const [editData, setEditData] = useState({
    make: vehicle.make || "",
    model: vehicle.model || "",
    year: vehicle.year || "",
    type: vehicle.type || "",
    location: vehicle.location || "",
    pricePerDay: vehicle.pricePerDay || "",
  });

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // =========================
  // IMAGE FIX (Vercel + future Cloudinary safe)
  // =========================
  const imageUrl =
    vehicle.image && typeof vehicle.image === "string"
      ? vehicle.image.startsWith("http")
        ? vehicle.image
        : `https://vehicle-rental-backend-mu.vercel.app/api${
            vehicle.image.startsWith("/") ? "" : "/"
          }${vehicle.image}`
      : FALLBACK_IMAGE;

  // =========================
  // FETCH REVIEWS
  // =========================
  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/${vehicle._id}`);
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setReviews([]);
    }
  };

  useEffect(() => {
    if (vehicle?._id) fetchReviews();
  }, [vehicle?._id]);

  const vehicleOwnerId =
    typeof vehicle.userId === "string"
      ? vehicle.userId
      : vehicle.userId?._id;

  const isOwnVehicle = user?._id && vehicleOwnerId === user._id;

  // =========================
  // BOOK VEHICLE
  // =========================
  const bookVehicle = async () => {
    if (loading || isBookingRef.current) return;

    if (!user?._id) {
      toast.error("Please login first");
      return;
    }

    if (isOwnVehicle) {
      toast.error("You cannot book your own vehicle");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select both dates");
      return;
    }

    try {
      isBookingRef.current = true;
      setLoading(true);

      const res = await api.post("/bookings", {
        userId: user._id,
        vehicleId: vehicle._id,
        startDate,
        endDate,
      });

      toast.success(res.data?.message || "Booking successful");

      setStartDate("");
      setEndDate("");

      refreshVehicles?.();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
      setTimeout(() => {
        isBookingRef.current = false;
      }, 300);
    }
  };

  // =========================
  // UPDATE VEHICLE
  // =========================
  const updateVehicle = async () => {
    try {
      await api.put(`/vehicles/${vehicle._id}`, editData);
      toast.success("Vehicle updated");
      setIsEditing(false);
      refreshVehicles?.();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  // =========================
  // UNLIST VEHICLE
  // =========================
  const unlistVehicle = async () => {
    const ok = window.confirm(
      "Are you sure you want to unlist this vehicle?"
    );
    if (!ok) return;

    try {
      await api.patch(`/vehicles/${vehicle._id}/unlist`);
      toast.success("Vehicle unlisted");
      refreshVehicles?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to unlist");
    }
  };

  // =========================
  // RELIST VEHICLE
  // =========================
  const relistVehicle = async () => {
    try {
      await api.patch(`/vehicles/${vehicle._id}/relist`);
      toast.success("Vehicle relisted");
      refreshVehicles?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to relist");
    }
  };

  // =========================
  // SAFE AVERAGE RATING
  // =========================
  const validRatings = reviews
    .map((r) => Number(r.rating))
    .filter((r) => !isNaN(r));

  const avgRating =
    validRatings.length > 0
      ? validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length
      : 0;

  const today = new Date().toISOString().split("T")[0];

  // =========================
  // UNLISTED STATE
  // =========================
  if (vehicle.available === false) {
    return (
      <div className="bg-gray-200 p-4 rounded-xl shadow transition hover:scale-[1.02]">
        <img
          src={imageUrl}
          className="h-40 w-full object-cover rounded mb-2"
          alt="vehicle"
        />

        <p className="font-semibold">This vehicle is unlisted</p>

        {isOwnVehicle && (
          <button
            onClick={relistVehicle}
            className="mt-2 bg-green-600 text-white px-3 py-1 rounded transition transform active:scale-95 hover:scale-105"
          >
            Relist Vehicle
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col transition transform hover:scale-[1.02] hover:shadow-xl">

      {/* IMAGE */}
      <img
        src={imageUrl}
        alt={`${vehicle.make} ${vehicle.model}`}
        className="h-48 w-full object-cover rounded mb-4"
        onError={(e) => {
          e.target.src = FALLBACK_IMAGE;
        }}
      />

      {/* EDIT MODE */}
      {isEditing ? (
        <div className="space-y-2">
          <input
            className="border p-2 w-full rounded"
            value={editData.make}
            onChange={(e) =>
              setEditData({ ...editData, make: e.target.value })
            }
            placeholder="Make"
          />

          <input
            className="border p-2 w-full rounded"
            value={editData.model}
            onChange={(e) =>
              setEditData({ ...editData, model: e.target.value })
            }
            placeholder="Model"
          />

          <input
            className="border p-2 w-full rounded"
            value={editData.year}
            onChange={(e) =>
              setEditData({ ...editData, year: e.target.value })
            }
            placeholder="Year"
          />

          <input
            className="border p-2 w-full rounded"
            value={editData.type}
            onChange={(e) =>
              setEditData({ ...editData, type: e.target.value })
            }
            placeholder="Type"
          />

          <input
            className="border p-2 w-full rounded"
            value={editData.location}
            onChange={(e) =>
              setEditData({ ...editData, location: e.target.value })
            }
            placeholder="Location"
          />

          <input
            className="border p-2 w-full rounded"
            value={editData.pricePerDay}
            onChange={(e) =>
              setEditData({ ...editData, pricePerDay: e.target.value })
            }
            placeholder="Price"
          />

          <div className="flex gap-2">
            <button
              onClick={updateVehicle}
              className="bg-green-600 text-white px-3 py-1 rounded transition transform active:scale-95 hover:scale-105"
            >
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-3 py-1 rounded transition transform active:scale-95 hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p><b>Make:</b> {vehicle.make}</p>
          <p><b>Model:</b> {vehicle.model}</p>
          <p><b>Year:</b> {vehicle.year}</p>
          <p><b>Type:</b> {vehicle.type}</p>
          <p><b>Location:</b> {vehicle.location}</p>
          <p><b>Price:</b> ${vehicle.pricePerDay}</p>

          <p className="text-yellow-500 font-semibold mt-1">
            {reviews.length ? `★ ${avgRating.toFixed(1)}` : "No ratings"}
          </p>

          {isOwnVehicle && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-3 py-1 rounded transition transform active:scale-95 hover:scale-105"
              >
                Edit
              </button>

              <button
                onClick={unlistVehicle}
                className="bg-red-600 text-white px-3 py-1 rounded transition transform active:scale-95 hover:scale-105"
              >
                Unlist
              </button>
            </div>
          )}

          <div className="mt-4 flex flex-col gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={today}
              className="border p-2 rounded"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || today}
              className="border p-2 rounded"
            />
          </div>

          <button
            onClick={bookVehicle}
            disabled={loading || isOwnVehicle}
            className={`p-2 mt-3 rounded text-white transition transform active:scale-95 hover:scale-105 ${
              loading || isOwnVehicle
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isOwnVehicle
              ? "Cannot book your vehicle"
              : loading
              ? "Booking..."
              : "Book Now"}
          </button>
        </>
      )}
    </div>
  );
}