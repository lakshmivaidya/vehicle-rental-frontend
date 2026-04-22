import { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function ListVehicle() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    type: "",
    location: "",
    pricePerDay: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    // Validation
    if (
      !form.make ||
      !form.model ||
      !form.year ||
      !form.type ||
      !form.location ||
      !form.pricePerDay
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      // ✅ Get logged in user
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user._id) {
        alert("Please login first");
        return;
      }

      // ✅ Use FormData for file upload
      const formData = new FormData();

      formData.append("make", form.make);
      formData.append("model", form.model);
      formData.append("year", Number(form.year));
      formData.append("type", form.type);
      formData.append("location", form.location);
      formData.append("pricePerDay", Number(form.pricePerDay));

      // 🔥 CRITICAL (DO NOT REMOVE)
      formData.append("userId", user._id);

      // ✅ Image file
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await api.post("/vehicles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Vehicle listed successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(
        "Failed to list vehicle: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">List Your Vehicle</h2>

      <input
        name="make"
        placeholder="Make"
        value={form.make}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded"
      />

      <input
        name="model"
        placeholder="Model"
        value={form.model}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded"
      />

      <input
        name="year"
        placeholder="Year"
        type="number"
        value={form.year}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded"
      />

      <input
        name="type"
        placeholder="Category/Type (Car, Bike, SUV...)"
        value={form.type}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded"
      />

      <input
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded"
      />

      <input
        name="pricePerDay"
        placeholder="Price per Day"
        type="number"
        value={form.pricePerDay}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded"
      />

      {/* ✅ FILE UPLOAD INSTEAD OF URL */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="border p-2 w-full mb-2 rounded"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white p-2 w-full rounded mt-2 transition transform hover:bg-blue-700 hover:scale-[1.02] active:scale-95"
      >
        List Vehicle
      </button>
    </div>
  );
}