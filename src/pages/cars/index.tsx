import { useState, useEffect } from "react";
import { Container } from "../../Components/Container";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/fbConect";
import { Swiper, SwiperSlide } from "swiper/react";

interface CarsProps {
  id: string;
  name: string;
  model: string;
  price: string | number;
  year: string;
  describe: string;
  city: string;
  uid: string;
  km: string;
  createIn: string;
  user: string;
  whatsapp: string;
  images: CarsImagesProps[];
}

interface CarsImagesProps {
  uid: string;
  name: string;
  url: string;
}

export function Cars() {
  const { id } = useParams();
  const [cars, setCars] = useState<CarsProps>();
  const [slider, setSlider] = useState<number>(2);
  const navigate = useNavigate();

  useEffect(() => {
    const loadingCar = async () => {
      if (!id) {
        return;
      }

      const carRef = doc(db, "cars", id);
      await getDoc(carRef).then((snapshot) => {
        if (!snapshot.data()) {
          navigate("/");
        }
        setCars({
          id: snapshot.id,
          name: snapshot.data()?.name,
          year: snapshot.data()?.year,
          city: snapshot.data()?.city,
          createIn: snapshot.data()?.createIn,
          images: snapshot.data()?.images,
          describe: snapshot.data()?.describe,
          km: snapshot.data()?.km,
          model: snapshot.data()?.model,
          price: snapshot.data()?.price,
          uid: snapshot.data()?.uid,
          user: snapshot.data()?.user,
          whatsapp: snapshot.data()?.whatsapp,
        });
      });
    };

    loadingCar();
  }, [id]);

  useEffect(() => {
    const handleScreenSize = () => {
      if (window.innerWidth < 720) {
        setSlider(1);
      } else {
        setSlider(2);
      }
    };

    handleScreenSize();

    window.addEventListener("resize", handleScreenSize);

    return () => {
      window.removeEventListener("resize", handleScreenSize);
    };
  }, []);

  return (
    <Container>
      {cars && (
        <Swiper
          slidesPerView={slider}
          pagination={{ clickable: true }}
          navigation
        >
          {cars?.images.map((image) => (
            <SwiperSlide key={image.name}>
              <img src={image.url} className="w-full h-96 object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {cars && (
        <main className="w-full bg-white rounded-lg p-5 my-4">
          <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
            <h1 className="font-bold text-3xl text-black">{cars?.name}</h1>
            <h1 className="font-bold text-3xl text-black">R$ {cars.price}</h1>
          </div>

          <p>{cars?.model}</p>

          <div className="flex w-full gap-6 my-4">
            <div className="flex flex-col gap-6">
              <div>
                <p>Cidade</p>
                <strong>{cars?.city}</strong>
              </div>
              <div>
                <p>Ano</p>
                <strong>{cars?.year}</strong>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <p>KM</p>
                <strong>{cars?.km}</strong>
              </div>
            </div>
          </div>

          <strong>Descrição</strong>
          <p className="mb-4">{cars.describe}</p>

          <strong> Contato / WhatsApp</strong>
          <p>{cars.whatsapp}</p>

          <a
            href={`https://api.whatsapp.com/send?phone=${cars?.whatsapp}&text=Olá ${cars?.user}, vi esse ${cars?.name} e fiquei interessado`}
            target="_blank"
            className="w-full flex items-center justify-center gap-2 my-6 cursor-pointer text-xl focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Conversar com vendedor
            <svg
              className="w-6 h-6 text-white dark:text-gray-800"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M12 4a8 8 0 0 0-6.895 12.06l.569.718-.697 2.359 2.32-.648.379.243A8 8 0 1 0 12 4ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.96 9.96 0 0 1-5.016-1.347l-4.948 1.382 1.426-4.829-.006-.007-.033-.055A9.958 9.958 0 0 1 2 12Z"
                clipRule="evenodd"
              />
              <path
                fill="currentColor"
                d="M16.735 13.492c-.038-.018-1.497-.736-1.756-.83a1.008 1.008 0 0 0-.34-.075c-.196 0-.362.098-.49.291-.146.217-.587.732-.723.886-.018.02-.042.045-.057.045-.013 0-.239-.093-.307-.123-1.564-.68-2.751-2.313-2.914-2.589-.023-.04-.024-.057-.024-.057.005-.021.058-.074.085-.101.08-.079.166-.182.249-.283l.117-.14c.121-.14.175-.25.237-.375l.033-.066a.68.68 0 0 0-.02-.64c-.034-.069-.65-1.555-.715-1.711-.158-.377-.366-.552-.655-.552-.027 0 0 0-.112.005-.137.005-.883.104-1.213.311-.35.22-.94.924-.94 2.16 0 1.112.705 2.162 1.008 2.561l.041.06c1.161 1.695 2.608 2.951 4.074 3.537 1.412.564 2.081.63 2.461.63.16 0 .288-.013.4-.024l.072-.007c.488-.043 1.56-.599 1.804-1.276.192-.534.243-1.117.115-1.329-.088-.144-.239-.216-.43-.308Z"
              />
            </svg>
          </a>
        </main>
      )}
    </Container>
  );
}
