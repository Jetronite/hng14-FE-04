export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center"
    >
      {/* TITLE */}
      <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
        Habit Tracker
      </h1>

      {/* SUBTEXT (optional but recommended) */}
      <p className="text-sm md:text-base text-gray-500 mb-8 max-w-md">
        Build consistency. Track your habits. Improve your life daily.
      </p>

    </div>
  );
}