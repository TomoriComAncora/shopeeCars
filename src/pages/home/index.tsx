import { useState, useEffect } from "react";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../services/fbConect";
import { Container } from "../../Components/Container";
import { Link } from "react-router-dom";

interface CarsProps {
  id: string;
  name: string;
  model: string;
  price: string | number;
  year: string;
  city: string;
  uid: string;
  km: string;
  images: CarsImagesProps[];
}

interface CarsImagesProps {
  uid: string;
  name: string;
  url: string;
}

export function Home() {
  const [cars, setCars] = useState<CarsProps[]>([]);
  const [loadingImages, setLoadingImages] = useState<string[]>([]);

  useEffect(() => {
    const loadingCars = () => {
      const carsRef = collection(db, "cars");
      const querryRef = query(carsRef, orderBy("createIn", "desc"));

      getDocs(querryRef).then((snapshot) => {
        let listCars = [] as CarsProps[];
        snapshot.forEach((doc) => {
          listCars.push({
            id: doc.id,
            name: doc.data().name,
            model: doc.data().model,
            price: doc.data().price,
            year: doc.data().year,
            city: doc.data().city,
            uid: doc.data().uid,
            km: doc.data().km,
            images: doc.data().images,
          });
        });

        setCars(listCars);
      });
    };

    loadingCars();
  }, []);

  const handleLoadingImage = (id: string) => {
    setLoadingImages((prevImages) => [...prevImages, id]);
  };

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
          {cars.map((itens) => (
            <Link to={`/cars/${itens.id}`} key={itens.id}>
              <section className="w-full bg-white rounded-lg" key={itens.id}>
                <div
                  role="status"
                  className="w-full rounded-lg mb-2 h-72 border-gray-200 shadow animate-pulse md:p-6 dark:border-gray-700 bg-slate-300"
                  style={{
                    display: loadingImages.includes(itens.id)
                      ? "none"
                      : "block",
                  }}
                ></div>
                <img
                  src={itens.images[0].url}
                  alt="foto do carro"
                  className="w-full rounded-lg mb-2 h-72 object-cover hover:scale-105 transition-all"
                  onLoad={() => handleLoadingImage(itens.id)}
                  style={{
                    display: loadingImages.includes(itens.id)
                      ? "block"
                      : "none",
                  }}
                />
                <div
                  className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mt-1 mb-2 ml-2 px-2"
                  style={{
                    display: loadingImages.includes(itens.id)
                      ? "none"
                      : "block",
                  }}
                ></div>
                <p
                  className="font-bold mt-1 mb-2 px-2"
                  style={{
                    display: loadingImages.includes(itens.id)
                      ? "block"
                      : "none",
                  }}
                >
                  {itens.name}
                </p>

                <div className="flex flex-col px-2">
                  <div
                    className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"
                    style={{
                      display: loadingImages.includes(itens.id)
                        ? "none"
                        : "block",
                    }}
                  ></div>
                  <span
                    className="text-zinc-700 mb-6 font-medium"
                    style={{
                      display: loadingImages.includes(itens.id)
                        ? "block"
                        : "none",
                    }}
                  >
                    Ano {itens.year} | {itens.km} KM
                  </span>
                  <div
                    className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"
                    style={{
                      display: loadingImages.includes(itens.id)
                        ? "none"
                        : "block",
                    }}
                  ></div>
                  <strong
                    className="text-black font-medium text-xl"
                    style={{
                      display: loadingImages.includes(itens.id)
                        ? "block"
                        : "none",
                    }}
                  >
                    R$ {itens.price}
                  </strong>
                </div>

                <div className="w-full h-px bg-slate-300 my-2"></div>

                <div className="px-2 pb-2">
                  <div
                    className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"
                    style={{
                      display: loadingImages.includes(itens.id)
                        ? "none"
                        : "block",
                    }}
                  ></div>
                  <span
                    className="text-zinc-700 font-medium"
                    style={{
                      display: loadingImages.includes(itens.id)
                        ? "block"
                        : "none",
                    }}
                  >
                    {itens.city}
                  </span>
                </div>
              </section>
            </Link>
          ))}
        </main>
      </Container>
    </div>
  );
}
