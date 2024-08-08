/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        azul: "#03071e",
        azulFraco: "#03052e"
      },
    },
  },
  plugins: [require("flowbite/plugin"), flowbite.plugin()],
};
