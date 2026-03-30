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
    image: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Basic validation
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
      const res = await api.post("/vehicles", {
        ...form,
        year: Number(form.year),
        pricePerDay: Number(form.pricePerDay),
      });
      alert("Vehicle listed successfully!");
      navigate("/"); // redirect to Vehicles page
    } catch (err) {
      console.error(err);
      alert("Failed to list vehicle: " + (err.response?.data?.message || err.message));
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
      <input
        name="image"
        placeholder="Image URL (optional)"
        value={form.image}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700 mt-2"
      >
        List Vehicle
      </button>
    </div>
  );
}