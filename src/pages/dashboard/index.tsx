import { useEffect, useState, useContext } from "react";
import { Container } from "../../Components/Container";
import { DashboardHeader } from "../../Components/PanelHeader";
import {
  collection,
  getDocs,
  where,
  doc,
  deleteDoc,
  query,
} from "firebase/firestore";
import { db, storage } from "../../services/fbConect";
import { ref, deleteObject } from "firebase/storage";
import { AuthContext } from "../../contexts/AuthContexts";

interface CarsProps {
  id: string;
  name: string;
  model: string;
  price: string | number;
  year: string;
  city: string;
  uid: string;
  km: string;
  images: CarsImageProps[];
}

interface CarsImageProps {
  uid: string;
  name: string;
  url: string;
}

export function Dashboard() {
  const [cars, setCars] = useState<CarsProps[]>([]);
  const [loadingImages, setLoadingImages] = useState<string[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadingCars = () => {
      if (!user?.uid) {
        return;
      }

      const carsRef = collection(db, "cars");
      const querryRef = query(carsRef, where("uid", "==", user.uid));

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
        console.log(listCars);
      });
    };

    loadingCars();
  }, [user]);

  const handleDeleteCars = async (item: CarsProps) => {
    const delRef = doc(db, "cars", item.id);
    await deleteDoc(delRef);
     item.images.map(async (image) => {
       const roadImage = `images/${image.uid}/${image.name}`;
       const imgRef = ref(storage, roadImage);

       try {
         await deleteObject(imgRef);
         setCars(cars.filter((cars) => cars.id !== item.id));
       } catch (err) {
         console.log("Erro ao deletar imagem");
       }
     });
  };

  const handleLoadingImages = (id: string) => {
    setLoadingImages((prevImages) => [...prevImages, id]);
  };

  return (
    <Container>
      <DashboardHeader />
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((items) => (
          <section
            key={items.id}
            className="w-full bg-white rounded-lg relative"
          >
            <button
              className="absolute bg-white w-10 h-10 rounded-full flex items-center justify-center right-2 top-2 drop-shadow"
              onClick={() => {
                handleDeleteCars(items);
              }}
            >
              <svg
                className="w-6 h-6 text-black dark:text-gray-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                />
              </svg>
            </button>
            <div
              role="status"
              className="w-full rounded-lg mb-2 h-72 border-gray-200 shadow animate-pulse md:p-6 dark:border-gray-700 bg-slate-300"
              style={{
                display: loadingImages.includes(items.id) ? "none" : "block",
              }}
            ></div>
            <img
              className="w-full rounded-lg mb-2 max-h-72"
              src={items.images[0].url}
              onLoad={() => handleLoadingImages(items.id)}
              style={{
                display: loadingImages.includes(items.id) ? "block" : "none",
              }}
            />
            <div
              className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mt-1 mb-2 ml-2 px-2"
              style={{
                display: loadingImages.includes(items.id) ? "none" : "block",
              }}
            ></div>
            <p
              className="font-bold mt-1 px-2"
              style={{
                display: loadingImages.includes(items.id) ? "block" : "none",
              }}
            >
              {items.name}
            </p>

            <div className="flex flex-col px-2">
              <div
                className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mt-1 mb-2 ml-2 px-2"
                style={{
                  display: loadingImages.includes(items.id) ? "none" : "block",
                }}
              ></div>
              <span
                style={{
                  display: loadingImages.includes(items.id) ? "block" : "none",
                }}
              >
                Ano {items.year} | {items.km} KM
              </span>
              <div
                className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mt-1 mb-2 ml-2 px-2"
                style={{
                  display: loadingImages.includes(items.id) ? "none" : "block",
                }}
              ></div>
              <strong
                style={{
                  display: loadingImages.includes(items.id) ? "block" : "none",
                }}
                className="text-black font-bold mt-4"
              >
                R$ {items.price}
              </strong>
            </div>

            <div className=" w-full h-px bg-slate-300 my-2"></div>
            <div
              className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mt-1 mb-2 ml-2 px-2"
              style={{
                display: loadingImages.includes(items.id) ? "none" : "block",
              }}
            ></div>
            <div className="px-2 pb-2">
              <span
                style={{
                  display: loadingImages.includes(items.id) ? "block" : "none",
                }}
              >
                {items.city}
              </span>
            </div>
          </section>
        ))}
      </main>
    </Container>
  );
}
