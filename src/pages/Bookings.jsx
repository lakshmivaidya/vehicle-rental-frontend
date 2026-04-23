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

      const userBookings = res.data.filter((b) => {
        if (b.userId?._id) return b.userId._id === user._id;
        return b.userId === user._id;
      });

      setBookings(userBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error("Failed to fetch bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN") : "N/A";

  const formatDateTime = (date) =>
    date
      ? new Date(date).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        })
      : "N/A";

  // =========================
  // FIX 1: PREVENT PAGE RELOAD
  // =========================
  const handleAction = async (e, id, action) => {
    if (e) e.preventDefault(); // 🔥 prevents accidental reload/navigation

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

  // =========================
  // FIX 2: PREVENT PAGE RELOAD
  // =========================
  const handleReviewSubmit = async (e, bookingId) => {
    if (e) e.preventDefault(); // 🔥 prevents reload

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

  const getVehicleImage = (image) => {
    if (!image) return "https://via.placeholder.com/300";
    if (image.startsWith("http")) return image;
    return `https://vehicle-rental-backend-mu.vercel.app/api${image}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        My Bookings
      </h1>

      {bookings.length === 0 && (
        <p className="text-gray-600 text-lg">No bookings yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* IMAGE */}
            {b.vehicleId?.image && (
              <img
                src={getVehicleImage(b.vehicleId.image)}
                alt={`${b.vehicleId?.make} ${b.vehicleId?.model}`}
                className="h-48 w-full object-cover"
              />
            )}

            <div className="p-4 flex flex-col gap-2">
              <p className="font-semibold text-xl text-gray-800">
                {b.vehicleId?.make} {b.vehicleId?.model}
              </p>

              <p className="text-gray-700">
                <span className="font-semibold">Booking Dates:</span>{" "}
                {formatDate(b.startDate)} → {formatDate(b.endDate)}
              </p>

              <p className="text-gray-500 text-sm">
                Booked At: {formatDateTime(b.createdAt)}
              </p>

              <p className="font-semibold text-gray-800">
                Total: ${b.totalPrice ?? "N/A"}
              </p>

              {/* ACTION BUTTONS (FIXED) */}
              <div className="flex gap-2 flex-wrap mt-2">
                {user?.role === "user" && b.status === "booked" && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => handleAction(e, b._id, "pay")}
                      className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                      Pay
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleAction(e, b._id, "cancel")}
                      className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                      Cancel
                    </button>
                  </>
                )}

                {user?.role === "user" && b.status === "paid" && (
                  <button
                    type="button"
                    onClick={(e) => handleAction(e, b._id, "complete")}
                    className="px-4 py-2 bg-purple-600 text-white rounded"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>

              {/* REVIEW SECTION */}
              {user?.role === "user" && b.status === "completed" && (
                <div className="mt-3 flex flex-col gap-2">
                  {b.review?.rating ? (
                    <div className="bg-gray-100 p-2 rounded">
                      <p className="text-yellow-600 font-semibold">
                        ⭐ {b.review.rating}/5
                      </p>
                      <p className="text-gray-700">
                        {b.review.comment}
                      </p>
                    </div>
                  ) : (
                    <>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        placeholder="Rating (1-5)"
                        className="border p-2 rounded"
                        value={reviewInputs[b._id]?.rating || ""}
                        onChange={(e) =>
                          handleReviewChange(
                            b._id,
                            "rating",
                            e.target.value
                          )
                        }
                      />

                      <input
                        type="text"
                        placeholder="Comment"
                        className="border p-2 rounded"
                        value={reviewInputs[b._id]?.comment || ""}
                        onChange={(e) =>
                          handleReviewChange(
                            b._id,
                            "comment",
                            e.target.value
                          )
                        }
                      />

                      <button
                        type="button"
                        className="px-4 py-2 bg-yellow-500 text-white rounded"
                        onClick={(e) => handleReviewSubmit(e, b._id)}
                      >
                        Submit Review
                      </button>
                    </>
                  )}
                </div>
              )}

              <p className="text-sm mt-2">
                Status:{" "}
                <span className="font-semibold">{b.status}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}