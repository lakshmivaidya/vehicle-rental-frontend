import { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ListVehicle() {
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    type: "",
    location: "",
    pricePerDay: "",
  });

  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);

  const validateField = (name, value) => {
    const trimmedValue = value?.toString().trim();

    switch (name) {
      case "make":
        if (!trimmedValue) return "Make is required";

        if (!/^[A-Za-z ]{2,30}$/.test(trimmedValue)) {
          return "Make should contain only letters";
        }

        return "";

      case "model":
        if (!trimmedValue) return "Model is required";

        if (!/^[A-Za-z0-9 -]{2,40}$/.test(trimmedValue)) {
          return "Model contains invalid characters";
        }

        return "";

      case "year":
        if (!trimmedValue) return "Year is required";

        const year = Number(trimmedValue);

        if (!Number.isInteger(year)) {
          return "Year must be a valid number";
        }

        if (year < 1990 || year > currentYear) {
          return `Year must be between 1990 and ${currentYear}`;
        }

        return "";

      case "type":
        if (!trimmedValue) return "Vehicle type is required";

        if (!/^[A-Za-z ]{2,20}$/.test(trimmedValue)) {
          return "Type should contain only letters";
        }

        return "";

      case "location":
        if (!trimmedValue) return "Location is required";

        if (!/^[A-Za-z0-9, -]{2,50}$/.test(trimmedValue)) {
          return "Enter a valid location";
        }

        return "";

      case "pricePerDay":
        if (!trimmedValue) return "Price is required";

        const price = Number(trimmedValue);

        if (isNaN(price)) {
          return "Price must be a number";
        }

        if (price < 100 || price > 100000) {
          return "Price must be between ₹100 and ₹100000";
        }

        return "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    setErrors({
      ...errors,
      [name]: validateField(name, value),
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setImageFile(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, JPEG, PNG and WEBP images are allowed");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      e.target.value = "";
      return;
    }

    setImageFile(file);
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(form).forEach((field) => {
      const error = validateField(field, form[field]);

      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
     alert("Please fill all the fields before submitting.");
     return;
                         }

    if (!imageFile) {
      toast.error("Vehicle image is required");
      return;
                    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user._id) {
        alert("Please login first");
        return;
      }

      const formData = new FormData();

      formData.append("make", form.make.trim());
      formData.append("model", form.model.trim());
      formData.append("year", Number(form.year));
      formData.append("type", form.type.trim());
      formData.append("location", form.location.trim());
      formData.append("pricePerDay", Number(form.pricePerDay));

      formData.append("userId", user._id);

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

  const handleCancel = () => {
  const hasData =
    form.make ||
    form.model ||
    form.year ||
    form.type ||
    form.location ||
    form.pricePerDay ||
    imageFile;

  if (!hasData) {
    navigate("/");
    return;
  }

  toast((t) => (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium">
        Do you want to cancel listing this vehicle?
      </p>

      <div className="flex gap-2 justify-end">
        <button
          onClick={() => {
            toast.dismiss(t.id);
          }}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition"
        >
          No
        </button>

        <button
          onClick={() => {
            toast.dismiss(t.id);
            navigate("/");
          }}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          Yes
        </button>
      </div>
    </div>
  ));
};

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">List Your Vehicle</h2>

      <input
        name="make"
        placeholder="Make"
        value={form.make}
        onChange={handleChange}
        className="border p-2 w-full mb-1 rounded"
      />

      {errors.make && (
        <p className="text-red-500 text-sm mb-2">{errors.make}</p>
      )}

      <input
        name="model"
        placeholder="Model"
        value={form.model}
        onChange={handleChange}
        className="border p-2 w-full mb-1 rounded"
      />

      {errors.model && (
        <p className="text-red-500 text-sm mb-2">{errors.model}</p>
      )}

      <input
        name="year"
        placeholder="Year"
        type="number"
        value={form.year}
        onChange={handleChange}
        className="border p-2 w-full mb-1 rounded"
      />

      {errors.year && (
        <p className="text-red-500 text-sm mb-2">{errors.year}</p>
      )}

      <input
        name="type"
        placeholder="Category/Type (Car, Bike, SUV...)"
        value={form.type}
        onChange={handleChange}
        className="border p-2 w-full mb-1 rounded"
      />

      {errors.type && (
        <p className="text-red-500 text-sm mb-2">{errors.type}</p>
      )}

      <input
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
        className="border p-2 w-full mb-1 rounded"
      />

      {errors.location && (
        <p className="text-red-500 text-sm mb-2">{errors.location}</p>
      )}

      <input
        name="pricePerDay"
        placeholder="Price per Day"
        type="number"
        value={form.pricePerDay}
        onChange={handleChange}
        className="border p-2 w-full mb-1 rounded"
      />

      {errors.pricePerDay && (
        <p className="text-red-500 text-sm mb-2">
          {errors.pricePerDay}
        </p>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="border p-2 w-full mb-4 rounded"
      />

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white p-2 w-full rounded transition transform hover:bg-blue-700 hover:scale-[1.02] active:scale-95"
        >
          List Vehicle
        </button>

        <button
          onClick={handleCancel}
          className="bg-red-500 text-white p-2 w-full rounded transition transform hover:bg-red-600 hover:scale-[1.02] active:scale-95"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}