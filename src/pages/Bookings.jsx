import { useEffect, useState } from "react";
import { api } from "../api";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "N/A" : d.toLocaleString();
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return "N/A";
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return "N/A";
    return Math.ceil((e - s) / (1000 * 60 * 60 * 24));
  };

  const handlePay = async (id) => {
    try {
      await api.post(`/bookings/pay/${id}`);
      alert("Payment successful!");
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.delete(`/bookings/cancel/${id}`);
      alert("Booking canceled!");
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking");
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.post(`/bookings/complete/${id}`);
      alert("Booking marked as completed!");
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to complete booking");
    }
  };

  const handleReview = (booking) => {
    const rating = prompt("Rate this vehicle from 1 to 5:");
    const comment = prompt("Write your review:");

    if (!rating || rating < 1 || rating > 5) {
      alert("Invalid rating");
      return;
    }

    api.post(`/bookings/review/${booking._id}`, { rating, comment })
      .then(() => {
        alert("Review submitted!");
        fetchBookings();
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to submit review");
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 && <p>No bookings yet.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookings.map((b) => {
          const status = b.status;

          return (
            <div key={b._id} className="bg-white p-4 rounded shadow flex flex-col">

              {b.vehicleId?.image && (
                <img
                  src={b.vehicleId.image}
                  alt={`${b.vehicleId.make} ${b.vehicleId.model}`}
                  className="h-48 w-full object-cover rounded mb-3"
                />
              )}

              <p className="font-semibold text-lg mb-1">
                <span className="text-gray-700">Make:</span> {b.vehicleId?.make}
              </p>

              <p className="font-semibold text-lg mb-2">
                <span className="text-gray-700">Model:</span> {b.vehicleId?.model}
              </p>

              <p className="mt-2 text-gray-600">
                {formatDate(b.startDate)} → {formatDate(b.endDate)}
              </p>

              <p className="text-gray-600">
                Duration: {calculateDays(b.startDate, b.endDate)} day(s)
              </p>

              <p className="mt-1 font-semibold">
                Total: ${b.totalPrice ?? "N/A"}
              </p>

              <div className="mt-2 flex gap-2 flex-wrap">

                {/* USER ONLY ACTIONS */}
                {user?.role === "user" && status === "booked" && (
                  <>
                    <button
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                      onClick={() => handlePay(b._id)}
                    >
                      Pay
                    </button>

                    <button
                      className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                      onClick={() => handleCancel(b._id)}
                    >
                      Cancel
                    </button>
                  </>
                )}

                {user?.role === "user" && status === "paid" && (
                  <button
                    className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
                    onClick={() => handleComplete(b._id)}
                  >
                    Mark as Completed
                  </button>
                )}

                {user?.role === "user" && status === "completed" && (
                  <button
                    className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                    onClick={() => handleReview(b)}
                  >
                    Leave Review
                  </button>
                )}

              </div>

              <p className="text-sm text-gray-500 mt-2">
                Status: {status.charAt(0).toUpperCase() + status.slice(1)}
              </p>

            </div>
          );
        })}
      </div>
    </div>
  );
}