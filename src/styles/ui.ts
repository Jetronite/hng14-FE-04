export const ui = {
  layout: {
    container: `
      min-h-screen 
      px-4 py-6 
      max-w-md mx-auto

      sm:max-w-xl
      md:max-w-2xl
      lg:max-w-4xl
    `,

    section: `
      mb-4
      sm:mb-6
    `,

    stack: `
      flex flex-col gap-3
      sm:gap-4
    `,
  },

  text: {
    heading: `
      text-lg font-bold
      sm:text-xl
      md:text-2xl
    `,

    subheading: `
      text-base font-semibold
      sm:text-lg
    `,

    body: `
      text-sm text-gray-300
      sm:text-base
    `,

    muted: `
      text-xs text-gray-400
      sm:text-sm
    `,
  },

  button: {
    base: `
      w-full sm:w-auto
      px-4 py-2
      rounded font-medium
      transition-all duration-200

      focus:outline-none focus:ring-2 focus:ring-offset-2
    `,

    primary: `
      bg-blue-600 text-white
      hover:bg-blue-700
      focus:ring-blue-500
    `,

    danger: `
      bg-red-500 text-white
      hover:bg-red-600
      focus:ring-red-500
    `,

    secondary: `
      bg-gray-700 text-white
      hover:bg-gray-600
      focus:ring-gray-500
    `,
  },

  input: {
    wrapper: "flex flex-col gap-1",

    base: `
      w-full
      border p-2 rounded
      bg-white-900 grey-white
      focus:outline-none focus:ring-2 focus:ring-blue-500
      sm:p-3
    `,

    label: `
      text-xs
      sm:text-sm
    `,
  },

  card: {
    base: `
      p-3
      sm:p-4

      rounded border
      transition-all duration-200
    `,

    completed: "bg-green-900 border-green-500",
    default: "bg-gray-800 border-gray-600",
  },

  auth: {
    page: `
    min-h-screen
    flex items-center justify-center
    px-4
    bg-gray-950
  `,

    card: `
    w-full max-w-md
    p-6 sm:p-8
    rounded-xl
    border border-gray-700
    bg-gray-900/80
    shadow-lg
    backdrop-blur
  `,
  },


  grid: {
    habits: `
      grid gap-3
      sm:grid-cols-2
      lg:grid-cols-3
    `,
  },
};