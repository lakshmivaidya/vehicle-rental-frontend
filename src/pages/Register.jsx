import { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/hero.jpg";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const getPasswordStrength = (password) => {
    if (!password) return "";
    if (password.length < 4) return "Weak";
    if (password.length < 8) return "Medium";
    return "Strong";
  };

  
  const isValidEmail = (email) => {
    return /@(gmail\.com|yahoo\.com|outlook\.com)$/.test(email);
  };

  const submit = async () => {
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    if (!isValidEmail(form.email)) {
      setError("Only Gmail, Yahoo, Outlook emails are allowed");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", form);

      alert("Account created successfully");

      navigate("/login");

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(form.password);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white overflow-x-hidden">

      <div className="flex justify-between items-center px-10 py-6 bg-[#0B0F19]/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800">

        <h1 className="text-2xl font-bold tracking-wide text-yellow-400">
          RideHub
        </h1>

        <div className="hidden md:flex gap-8 text-sm text-gray-300 font-medium">
          <a href="#home" className="hover:text-yellow-400 transition">
            Home
          </a>

          <a href="#about" className="hover:text-yellow-400 transition">
            About
          </a>

          <a href="#data" className="hover:text-yellow-400 transition">
            Open Data
          </a>

          <a href="#plans" className="hover:text-yellow-400 transition">
            Plans
          </a>

          <a href="#community" className="hover:text-yellow-400 transition">
            Community
          </a>
        </div>
      </div>

      <section
        id="home"
        className="relative flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-20"
      >

        <div className="max-w-2xl z-10">

          <div className="inline-block bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 px-4 py-2 rounded-full text-sm mb-6">
            Driver First Mobility Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Book rides with
            <br />

            <span className="text-yellow-400">
              Zero Commission
            </span>
          </h1>

          <p className="mt-8 text-gray-300 text-lg leading-relaxed max-w-xl">
            App by the drivers for the people.
            Direct payments. Fair pricing.
            Affordable rides across the city.
          </p>

          <div className="mt-8 flex gap-4 flex-wrap">

            <button
              type="button"
              className="px-6 py-3 bg-gray-800 hover:bg-black border border-gray-700 rounded-full transition shadow-lg"
            >
              🚕 Auto
            </button>

            <button
              type="button"
              className="px-6 py-3 bg-gray-800 hover:bg-black border border-gray-700 rounded-full transition shadow-lg"
            >
              🚗 Cab
            </button>

            <button
              type="button"
              className="px-6 py-3 bg-gray-800 hover:bg-black border border-gray-700 rounded-full transition shadow-lg"
            >
              🏍️ Bike
            </button>

          </div>

          <div className="mt-10 flex gap-10">

            <div>
              <h2 className="text-3xl font-bold text-yellow-400">
                10K+
              </h2>

              <p className="text-gray-400 text-sm">
                Daily rides
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-yellow-400">
                5K+
              </h2>

              <p className="text-gray-400 text-sm">
                Drivers
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-yellow-400">
                24/7
              </h2>

              <p className="text-gray-400 text-sm">
                Support
              </p>
            </div>

          </div>
        </div>

        <div className="mt-16 md:mt-0 relative flex justify-center w-full md:w-auto">

          <div className="absolute w-[420px] h-[420px] bg-yellow-400/10 blur-3xl rounded-full" />

          <img
            src={heroImg}
            alt="Ride illustration"
            className="relative z-10 w-[420px] md:w-[600px] drop-shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
          />
        </div>
      </section>

      <div className="flex justify-center px-6 pb-24">

        <div className="w-full max-w-md bg-white text-black rounded-[32px] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">

          <h2 className="text-3xl font-bold mb-2 text-center">
            Create Account
          </h2>

          <p className="text-center text-gray-500 mb-6 text-sm">
            Start booking rides instantly
          </p>

          {error && (
            <div className="mb-4 text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <input
            className="w-full p-4 mb-4 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            className="w-full p-4 mb-4 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <div className="relative mb-2">

            <input
              className="w-full p-4 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-sm text-gray-600 hover:text-black"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {form.password && (
            <p
              className={`text-sm mb-4 ${
                strength === "Weak"
                  ? "text-red-500"
                  : strength === "Medium"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              Password Strength: {strength}
            </p>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className={`w-full p-4 rounded-xl font-semibold transition active:scale-95 ${
              loading
                ? "bg-gray-400 text-white"
                : "bg-yellow-400 hover:bg-yellow-300 text-black"
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </div>


      <section
        id="about"
        className="px-10 md:px-20 py-20 bg-[#111827]"
      >
        <h2 className="text-4xl font-bold mb-6">
          About
        </h2>

        <p className="text-gray-400 max-w-3xl leading-relaxed text-lg">
          RideHub is a driver-first mobility platform designed to
          eliminate commission-based exploitation and empower both
          riders and drivers through transparent pricing and
          direct payments.
        </p>
      </section>

      <section
        id="data"
        className="px-10 md:px-20 py-20"
      >
        <h2 className="text-4xl font-bold mb-6">
          Open Data
        </h2>

        <p className="text-gray-400 max-w-3xl leading-relaxed text-lg">
          Transparent ride metrics, fair pricing systems and
          community-driven development ensure trust and openness
          across the platform ecosystem.
        </p>
      </section>

      <section
        id="plans"
        className="px-10 md:px-20 py-20 bg-[#111827]"
      >
        <h2 className="text-4xl font-bold mb-6">
          Plans
        </h2>

        <p className="text-gray-400 max-w-3xl leading-relaxed text-lg">
          Auto rides, bike taxi integration, EV support,
          corporate plans and hyperlocal ride systems are
          part of our expansion roadmap.
        </p>
      </section>

      <section
        id="community"
        className="px-10 md:px-20 py-20"
      >
        <h2 className="text-4xl font-bold mb-6">
          Community
        </h2>

        <p className="text-gray-400 max-w-3xl leading-relaxed text-lg">
          Built for the people and powered by community
          participation with an open and transparent
          mobility ecosystem.
        </p>
      </section>

    </div>
  );
}