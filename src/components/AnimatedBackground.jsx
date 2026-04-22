export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">

      {/* Soft Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-purple-100" />

      {/* Floating Blobs */}
      <div className="blob blob1 pointer-events-none" />
      <div className="blob blob2 pointer-events-none" />
      <div className="blob blob3 pointer-events-none" />

    </div>
  );
}