export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">

      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-indigo-100" />

      <div className="absolute top-10 w-[200%] h-40 opacity-20 animate-city-far">
        <div className="h-full bg-gradient-to-r from-gray-300 to-gray-200" />
      </div>

      <div className="absolute top-24 w-[200%] h-52 opacity-30 animate-city-mid">
        <div className="h-full bg-gradient-to-r from-gray-400 to-gray-300" />
      </div>

      <div className="absolute bottom-0 w-full h-28 bg-gray-900/10" />

      <div className="absolute bottom-10 w-[200%] h-2 bg-[repeating-linear-gradient(90deg,#94a3b8_0px,#94a3b8_40px,transparent_40px,transparent_80px)] animate-road opacity-70" />

      <div className="absolute bottom-14 text-4xl animate-carRightToLeft">
        🚗
      </div>

      <div className="absolute bottom-20 text-4xl animate-carRightToLeftSlow">
        🚙
      </div>

      <div className="absolute bottom-24 text-2xl animate-walkRightToLeft">
        🚶‍♂️ 🚶‍♀️
      </div>

      <div className="absolute bottom-16 text-3xl animate-bike">
        🏍️
      </div>

      <div className="blob blob1" />
      <div className="blob blob2" />
    </div>
  );
}