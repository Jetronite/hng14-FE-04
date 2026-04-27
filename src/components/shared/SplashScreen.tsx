import Link from "next/link";

export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="
        min-h-screen
        flex flex-col items-center justify-center
        bg-gray-50
        px-4
        text-center
      "
    >
      {/* TITLE */}
      <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
        Habit Tracker
      </h1>

      {/* SUBTEXT (optional but recommended) */}
      <p className="text-sm md:text-base text-gray-500 mb-8 max-w-md">
        Build consistency. Track your habits. Improve your life daily.
      </p>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Link href="/login" className="w-full">
          <button
            aria-label="Go to login page"
            className="
              w-full
              py-3 md:py-4
              text-sm md:text-base font-semibold
              rounded-lg
              bg-blue-600 text-white
              hover:bg-blue-700
              transition
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            "
          >
            Login
          </button>
        </Link>

        <Link href="/signup" className="w-full">
          <button
            aria-label="Go to sign up page"
            className="
              w-full
              py-3 md:py-4
              text-sm md:text-base font-semibold
              rounded-lg
              bg-gray-200 text-gray-800
              hover:bg-gray-300
              transition
              focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
            "
          >
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}