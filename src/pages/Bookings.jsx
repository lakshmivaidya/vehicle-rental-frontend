import { useEffect, useState } from "react";
import { api } from "../api";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState({}); // store reviews per booking
  const [userReviews, setUserReviews] = useState({}); // store user input per booking

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data);

      // fetch approved reviews for each booked vehicle
      const reviewsData = {};
      for (const b of res.data) {
        const revRes = await api.get(`/reviews/vehicle/${b.vehicleId._id}`);
        reviewsData[b._id] = revRes.data;
      }
      setReviews(reviewsData);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return "N/A";
    const s = new Date(start);
    const e = new Date(end);
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

  const submitReview = async (bookingId) => {
    const review = userReviews[bookingId];
    if (!review || !review.rating || !review.comment) {
      alert("Please enter rating and comment");
      return;
    }

    try {
      await api.post("/reviews", {
        userId: bookings.find((b) => b._id === bookingId).userId._id,
        vehicleId: bookings.find((b) => b._id === bookingId).vehicleId._id,
        rating: Number(review.rating),
        comment: review.comment,
      });
      alert("Review submitted for moderation!");
      setUserReviews({ ...userReviews, [bookingId]: { rating: "", comment: "" } });
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 && <p>No bookings yet.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="bg-white p-4 rounded shadow flex flex-col"
          >
            {/* Vehicle Image */}
            {b.vehicleId?.image && (
              <img
                src={b.vehicleId.image}
                alt={b.vehicleId.make}
                className="h-48 w-full object-cover rounded mb-3"
              />
            )}

            {/* Vehicle Basic Info */}
            <h2 className="font-bold text-lg mb-1">
              {b.vehicleId?.make} - {b.vehicleId?.model}
            </h2>

            <p className="text-gray-600">
              <strong>Year:</strong> {b.vehicleId?.year}
            </p>

            <p className="text-gray-600">
              <strong>Price per day:</strong> ${b.vehicleId?.pricePerDay}
            </p>

            <p
              className={`font-semibold ${
                b.vehicleId?.available ? "text-green-600" : "text-red-600"
              }`}
            >
              <strong>Availability:</strong>{" "}
              {b.vehicleId?.available ? "Available" : "Not Available"}
            </p>

            <hr className="my-2" />

            {/* User Info */}
            <p className="text-gray-700">
              <strong>Booked By:</strong> {b.userId?.name} ({b.userId?.email})
            </p>

            <p className="text-gray-600">
              <strong>Booked On:</strong> {formatDateTime(b.createdAt)}
            </p>

            {/* Status */}
            <p className="mt-2">
              <strong>Booking Status:</strong>{" "}
              {b.status === "booked" ? "Booked" : b.status}
            </p>

            <p>
              <strong>Payment Status:</strong> {b.paid ? "Paid" : "Unpaid"}
            </p>

            {/* Rental Info */}
            <p className="mt-2 text-gray-600">
              <strong>Rental:</strong> {formatDateTime(b.startDate)} →{" "}
              {formatDateTime(b.endDate)}
            </p>

            <p className="text-gray-600">
              <strong>Duration:</strong> {calculateDays(b.startDate, b.endDate)} day(s)
            </p>

            <p className="mt-1 font-semibold">
              <strong>Total:</strong> ${b.totalPrice}
            </p>

            {/* Buttons */}
            <div className="mt-3 flex gap-2">
              {!b.paid && (
                <button
                  className="bg-green-600 text-white p-2 rounded hover:bg-green-700 flex-1"
                  onClick={() => handlePay(b._id)}
                >
                  Pay
                </button>
              )}

              {!b.paid && (
                <button
                  className="bg-red-600 text-white p-2 rounded hover:bg-red-700 flex-1"
                  onClick={() => handleCancel(b._id)}
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Reviews Section */}
            <div className="mt-4 border-t pt-3">
              <h3 className="font-bold mb-2">Reviews</h3>

              {reviews[b._id] && reviews[b._id].length > 0 ? (
                <ul className="mb-3">
                  {reviews[b._id].map((r) => (
                    <li key={r._id} className="border-b py-1">
                      <strong>{r.userId?.name}:</strong> {r.comment}{" "}
                      <span className="text-yellow-500">({r.rating}/5)</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No reviews yet.</p>
              )}

              {/* Input for user to leave review */}
              <div className="mt-2 flex gap-2 items-center">
                <input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Rating (1-5)"
                  value={userReviews[b._id]?.rating || ""}
                  onChange={(e) =>
                    setUserReviews({
                      ...userReviews,
                      [b._id]: {
                        ...userReviews[b._id],
                        rating: e.target.value,
                      },
                    })
                  }
                  className="border p-1 w-24"
                  disabled={new Date(b.endDate) > new Date()} // only allow after rental ends
                />
                <input
                  type="text"
                  placeholder="Write a comment"
                  value={userReviews[b._id]?.comment || ""}
                  onChange={(e) =>
                    setUserReviews({
                      ...userReviews,
                      [b._id]: {
                        ...userReviews[b._id],
                        comment: e.target.value,
                      },
                    })
                  }
                  className="border p-1 flex-1"
                  disabled={new Date(b.endDate) > new Date()} // only allow after rental ends
                />
                <button
                  onClick={() => submitReview(b._id)}
                  className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700"
                  disabled={new Date(b.endDate) > new Date()} // only allow after rental ends
                >
                  Submit Review
                </button>
              </div>

              {new Date(b.endDate) > new Date() && (
                <p className="text-gray-500 text-sm mt-1">
                  You can leave a review after your rental ends.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}