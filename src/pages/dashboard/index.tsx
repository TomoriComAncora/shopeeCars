import { useEffect, useState, useContext } from "react";
import { Container } from "../../Components/Container";
import { DashboardHeader } from "../../Components/PanelHeader";
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../../services/fbConect";
import { AuthContext } from "../../contexts/AuthContexts";

interface CarsProps {
  id: string;
  name : string;
  model: string;
  price: string | number;
  year : string;
  city: string;
  uid: string;
  km: string;
  images: CarsImageProps[];
}

interface CarsImageProps {
  uid: string;
 name : string;
  url: string;
}

export function Dashboard() {
  const [cars, setCars] = useState<CarsProps[]>([]);
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

  return (
    <Container>
      <DashboardHeader />
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <section className="w-full bg-white rounded-lg relative">
          <button
            className="absolute bg-white w-10 h-10 rounded-full flex items-center justify-center right-2 top-2 drop-shadow"
            onClick={() => {}}
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
          <img
            className="w-full rounded-lg mb-2 max-h-72"
            src="https://firebasestorage.googleapis.com/v0/b/progweb-e5b15.appspot.com/o/images%2F7JtWS5QbaPgFxAg8mNQTZbwWYfo1%2F078b7b0e-ca9f-4e08-a25e-c1b217a7bb4a?alt=media&token=c40ece7e-c198-4b4a-a986-4c130165c756"
          />
          <p className="font-bold mt-1 px-2">NISSAN VERSA</p>

          <div className="flex flex-col px-2">
            <span>Ano 2016/2016 | 230.000 KM</span>
            <strong className="text-black font-bold mt-4">R$ 150.000</strong>
          </div>

          <div className=" w-full h-px bg-slate-200 my-2"></div>
          <div className="px-2 pb-2">
            <span>CORUMBÁ - MS</span>
          </div>
        </section>
      </main>
    </Container>
  );
}
