import { useEffect, useState } from "react";
import { api } from "../api";
import { toast } from "react-toastify";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [reviewInputs, setReviewInputs] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error("Failed to fetch bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ✅ DATE ONLY (NO TIME)
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN") : "N/A";

  // ✅ REAL TIME (IST)
  const formatDateTime = (date) =>
    date
      ? new Date(date).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        })
      : "N/A";

  const handleAction = async (id, action) => {
    try {
      if (action === "pay") await api.post(`/bookings/pay/${id}`);
      if (action === "cancel") await api.delete(`/bookings/cancel/${id}`);
      if (action === "complete") await api.post(`/bookings/complete/${id}`);
      toast.success(`Booking ${action} successful`);
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error(`Booking ${action} failed`);
    }
  };

  const handleReviewChange = (bookingId, field, value) => {
    setReviewInputs((prev) => ({
      ...prev,
      [bookingId]: {
        ...prev[bookingId],
        [field]: value,
      },
    }));
  };

  const handleReviewSubmit = async (bookingId) => {
    try {
      const review = reviewInputs[bookingId];

      if (!review || !review.rating || !review.comment) {
        toast.error("Please provide rating and comment");
        return;
      }

      await api.post(`/bookings/review/${bookingId}`, {
        rating: Number(review.rating),
        comment: review.comment,
      });

      toast.success("Review submitted successfully!");

      setReviewInputs((prev) => ({
        ...prev,
        [bookingId]: { rating: "", comment: "" },
      }));

      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 && <p>No bookings yet.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookings.map((b) => (
          <div key={b._id} className="bg-white p-4 rounded shadow flex flex-col">
            {b.vehicleId?.image && (
              <img
                src={b.vehicleId.image}
                alt={`${b.vehicleId.make} ${b.vehicleId.model}`}
                className="h-48 w-full object-cover rounded mb-3"
              />
            )}

            <p className="font-semibold text-lg mb-1">
              <span className="text-gray-700">Make:</span>{" "}
              {b.vehicleId?.make}
            </p>

            <p className="font-semibold text-lg mb-2">
              <span className="text-gray-700">Model:</span>{" "}
              {b.vehicleId?.model}
            </p>

            {/* ✅ FIXED: DATE ONLY */}
            <p>
              <span className="text-gray-700 font-semibold">Booking Dates:</span>{" "}
              {formatDate(b.startDate)} → {formatDate(b.endDate)}
            </p>

            {/* ✅ REAL BOOKING TIME */}
            <p className="text-sm text-blue-600">
              Booked At: {formatDateTime(b.createdAt)}
            </p>

            <p className="font-semibold">
              Total: ${b.totalPrice ?? "N/A"}
            </p>

            <div className="mt-2 flex gap-2 flex-wrap">
              {user?.role === "user" && b.status === "booked" && (
                <>
                  <button
                    className="bg-green-600 text-white px-4 py-1 rounded"
                    onClick={() => handleAction(b._id, "pay")}
                  >
                    Pay
                  </button>

                  <button
                    className="bg-red-600 text-white px-4 py-1 rounded"
                    onClick={() => handleAction(b._id, "cancel")}
                  >
                    Cancel
                  </button>
                </>
              )}

              {user?.role === "user" && b.status === "paid" && (
                <button
                  className="bg-purple-600 text-white px-4 py-1 rounded"
                  onClick={() => handleAction(b._id, "complete")}
                >
                  Mark as Completed
                </button>
              )}
            </div>

            {/* REVIEW SECTION */}
            {user?.role === "user" && b.status === "completed" && (
              <div className="mt-3 flex flex-col gap-1">
                {b.review?.rating ? (
                  <div className="bg-gray-100 p-2 rounded">
                    <p className="text-yellow-600 font-semibold">
                      ⭐ {b.review.rating}/5
                    </p>
                    <p className="text-sm">{b.review.comment}</p>
                  </div>
                ) : (
                  <>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      placeholder="Rating (1-5)"
                      className="border p-1 rounded"
                      value={reviewInputs[b._id]?.rating || ""}
                      onChange={(e) =>
                        handleReviewChange(b._id, "rating", e.target.value)
                      }
                    />

                    <input
                      type="text"
                      placeholder="Comment"
                      className="border p-1 rounded"
                      value={reviewInputs[b._id]?.comment || ""}
                      onChange={(e) =>
                        handleReviewChange(b._id, "comment", e.target.value)
                      }
                    />

                    <button
                      className="bg-yellow-500 text-white px-4 py-1 rounded mt-1"
                      onClick={() => handleReviewSubmit(b._id)}
                    >
                      Submit Review
                    </button>
                  </>
                )}
              </div>
            )}

            <p className="text-sm text-gray-500 mt-2">
              Status:{" "}
              {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}