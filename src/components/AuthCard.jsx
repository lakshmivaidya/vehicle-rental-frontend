export default function AuthCard({
  title,
  subtitle,
  children,
  onSubmit,
  buttonText,
  loading
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">

      <div className="w-full max-w-md p-8 bg-white/70 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl z-10 transition-all duration-300 hover:scale-[1.01]">

        <h1 className="text-3xl font-bold text-center mb-1">
          {title}
        </h1>

        {subtitle && (
          <p className="text-center text-gray-500 mb-6 text-sm">
            {subtitle}
          </p>
        )}

        {children}

        <button
          onClick={onSubmit}
          disabled={loading}
          className="btn-primary w-full mt-4"
        >
          {loading ? "Please wait..." : buttonText}
        </button>

      </div>
    </div>
  );
}