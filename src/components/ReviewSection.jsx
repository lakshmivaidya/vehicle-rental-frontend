import { useEffect, useState } from "react";
import { api } from "../api";

export default function ReviewSection({ vehicleId }) {
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ rating: "", comment: "" });
  const [completedBookingId, setCompletedBookingId] = useState(null);

  // Fetch existing reviews for this vehicle
  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/${vehicleId}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  // Find a completed booking for this vehicle for the current user
  const fetchCompletedBooking = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      const res = await api.get("/bookings");
      const completedBooking = res.data.find(
        (b) =>
          b.vehicleId?._id === vehicleId &&
          b.userId?._id === (user.id || user._id) &&
          new Date(b.endDate) < new Date() // booking completed
      );

      if (completedBooking) {
        setCompletedBookingId(completedBooking._id);
      }
    } catch (err) {
      console.error("Error fetching completed bookings:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchCompletedBooking();
  }, [vehicleId]);

  const submitReview = async () => {
    if (!completedBookingId) {
      alert("You can only review after completing a booking.");
      return;
    }
    try {
      await api.post("/reviews", {
        bookingId: completedBookingId,
        rating: Number(userReview.rating),
        comment: userReview.comment,
      });
      alert("Review submitted!");
      setUserReview({ rating: "", comment: "" });
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="mt-4 border-t pt-3">
      <h3 className="font-bold mb-2">Reviews</h3>

      {reviews.length === 0 && <p>No reviews yet.</p>}

      <ul className="mb-3">
        {reviews.map((r) => (
          <li key={r._id} className="border-b py-1">
            <strong>{r.userName}:</strong> {r.comment}{" "}
            <span className="text-yellow-500">({r.rating}/5)</span>
          </li>
        ))}
      </ul>

      {completedBookingId && (
        <div className="mt-2 flex flex-wrap gap-2 items-center">
          <input
            type="number"
            min="1"
            max="5"
            placeholder="Rating (1-5)"
            value={userReview.rating}
            onChange={(e) =>
              setUserReview({ ...userReview, rating: e.target.value })
            }
            className="border p-1 w-24"
          />
          <input
            type="text"
            placeholder="Write a comment"
            value={userReview.comment}
            onChange={(e) =>
              setUserReview({ ...userReview, comment: e.target.value })
            }
            className="border p-1 w-48"
          />
          <button
            onClick={submitReview}
            className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700"
          >
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
}