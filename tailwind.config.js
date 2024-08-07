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
        verdeEscuro: "#001219",
        verdeMedio: "#005f73",
        verde: "#0a9396",
        verdeClaro: "#94d2bd",
        bege: "#e9d8a6",
        laranjaClaro: "#ee9b00",
        laranja: "#ca6702",
        laranjaForte: "#bb3e03",
        vermelho: "#ae2012",
        vermelhoForte: "#9b2226",
      },
    },
  },
  plugins: [require("flowbite/plugin"), flowbite.plugin()],
};
