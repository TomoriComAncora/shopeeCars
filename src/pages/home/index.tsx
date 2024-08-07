import { Container } from "../../Components/Container";

export function Home() {
  return (
    <div>
      <Container>
        <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
          <label
            htmlFor="search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          ></label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              placeholder="Digite o carro que deseja"
              required
            />
            <button
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-res-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            >
              Buscar
            </button>
          </div>
        </section>

        <h1 className="font-bold text-center mt-6 text-2xl mb-4">
          Carros novos e usados em todo o Brasil
        </h1>

        <main className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <section className="w-full bg-white rounded-lg">
            <img
              src={
                "https://image.webmotors.com.br/_fotos/anunciousados/gigante/2024/202406/20240612/maserati-mc20-3.0-v6-biturbo-gasolina-dct-wmimagem13230179961.jpg?s=fill&w=552&h=414&q=60"
              }
              alt="foto do carro"
              className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
            />
            <p className="font-bold mt-1 mb-2 px-2">Maserati MC20</p>

            <div className="flex flex-col px-2">
              <span className="text-zinc-700 mb-6 font-medium">
                Ano 2021/2022 | 1600 KM
              </span>
              <strong className="text-black font-medium text-xl">
                R$ 3.299.999
              </strong>
            </div>

            <div className="w-full h-px bg-slate-300 my-2"></div>

            <div className="px-2 pb-2">
              <span className="text-zinc-700 font-medium">Brusque - SC</span>
            </div>
          </section>
        </main>
      </Container>
    </div>
  );
}
