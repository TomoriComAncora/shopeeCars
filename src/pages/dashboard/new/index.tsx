import { ChangeEvent, useState, useContext, useEffect } from "react";
import { Container } from "../../../Components/Container";
import { DashboardHeader } from "../../../Components/PanelHeader";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../../../Components/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileInput, Label, Textarea } from "flowbite-react";
import { AuthContext } from "../../../contexts/AuthContexts";
import { v4 as uuidV4 } from "uuid";
import { storage, db } from "../../../services/fbConect";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const schema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório"),
  model: z.string().min(1, "O modelo é obrigatótio"),
  year: z.string().min(1, "O Ano é obrigatório"),
  km: z.string().min(1, "O KM do carro é obrigatório"),
  price: z.string().min(1, "O preço é obrigatório"),
  city: z.string().min(1, "A cidade é obrigatória"),
  whatsapp: z
    .string()
    .min(1, "O telefone é obrigatório")
    .refine((value) => /^(\d{10,11})$/.test(value), {
      message: "Número de telefone inválido.",
    }),
  describe: z.string().min(1, "A descrição é obrigatória"),
});

type formData = z.infer<typeof schema>;

interface ImageItensProps {
  uid: string;
  name: string;
  prevUrl: string;
  url: string;
}

export function New() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<formData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const [imagesCar, setImagesCar] = useState<ImageItensProps[]>([]);
  const [edit, setEdit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getDataCars = async () => {
      if (!id) {
        return;
      }

      const docRef = doc(db, "cars", id);
      await getDoc(docRef)
        .then((snapshot) => {
          const data = snapshot.data();
          setValue("name", data?.name);
          setValue("year", data?.year);
          setValue("price", data?.price);
          setValue("city", data?.city);
          setValue("describe", data?.describe);
          setValue("km", data?.km);
          setValue("model", data?.model);
          setValue("whatsapp", data?.whatsapp);

          const images = data?.images.map((img: any) => ({
            uid: img.uid,
            name: img.name,
            prevUrl: img.url,
            url: img.url,
          }));

          setImagesCar(images);
          setEdit(true);
          toast.success("Nova imagem adicionada com sucesso!");
        })
        .catch((err) => {
          setEdit(false);
          console.log(err);
          toast.error("Problema ao adicionar nova imagem!");
        });
    };

    getDataCars();
  }, [id]);

  const handlefile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === "image/jpeg" || image.type === "image/png") {
        await handleUpload(image);
      } else {
        alert("Envie uma imagem jpeg ou png");
        return;
      }
    }
  };

  const handleUpload = async (image: File) => {
    if (!user?.uid) {
      return;
    }

    const uidCurrent = user?.uid;
    const uidImage = uuidV4();

    const uploadRef = ref(storage, `images/${uidCurrent}/${uidImage}`);

    uploadBytes(uploadRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        const imageItens = {
          name: uidImage,
          uid: uidCurrent,
          prevUrl: URL.createObjectURL(image),
          url: downloadUrl,
        };
        setImagesCar((prev) => [...prev, imageItens]);
        toast.success("Imagem cadastrada com sucesso!");
      });
    });
  };

  const onSubmit = (data: formData) => {
    console.log(data);
    if (imagesCar.length <= 2) {
      toast.error("Adicione no mínimo 3 imagens do carro!");
      return;
    }

    const listImagesCars = imagesCar.map((car) => {
      return {
        uid: car.uid,
        name: car.name,
        url: car.url,
      };
    });

    if (id) {
      const docRef = doc(db, "cars", id);
      updateDoc(docRef, {
        name: data.name.toUpperCase(),
        model: data.model,
        year: data.year,
        km: data.km,
        whatsapp: data.whatsapp,
        city: data.city,
        price: data.price,
        describe: data.describe,
        user: user?.name,
        uid: user?.uid,
        images: listImagesCars,
      })
        .then(() => {
          toast.success("Carro editado com sucesso!");
          reset();
          navigate("/dashboard");
          setEdit(false);
        })
        .catch(() => {
          toast.error("Problema ao editar este carro!");
        });
    }else{
      addDoc(collection(db, "cars"), {
        name: data.name.toUpperCase(),
        model: data.model,
        year: data.year,
        km: data.km,
        city: data.city,
        whatsapp: data.whatsapp,
        price: data.price,
        describe: data.describe,
        createIn: new Date(),
        user: user?.name,
        uid: user?.uid,
        images: listImagesCars,
      })
        .then(() => {
          reset();
          setImagesCar([]);
          console.log("Cadastrado com sucesso!");
          toast.success("Cadastrado com sucesso!");
        })
        .catch((err) => {
          console.log(err);
          console.log("Erro ao cadastrar carro!");
          toast.error("Erro ao cadastrar carro!");
        });
    }
  };

  const handleDeleteImage = async (item: ImageItensProps) => {
    const image = `images/${item.uid}/${item.name}`;
    const delRef = ref(storage, image);
    await deleteObject(delRef)
      .then(() => {
        console.log("Imagem deletada com sucesso!");
        toast.success("Imagem deletada com sucesso!");
        setImagesCar(imagesCar.filter((car) => car.url !== item.url));
      })
      .catch((err) => {
        console.log(err);
        console.log("Erro ao deletar imagem!");
        toast.error("Erro ao deletar imagem!");
      });
  };

  return (
    <Container>
      <DashboardHeader />
      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="file-upload" value="Carregar Arquivos" />
          </div>
          <FileInput
            id="file-upload"
            accept="image/*"
            onChange={handlefile}
            helperText="PNG, JPG."
          />
        </div>
        {imagesCar.map((item) => (
          <div
            key={item.name}
            className="w-full h-32 flex items-center justify-center relative"
          >
            <button
              className="absolute"
              onClick={() => handleDeleteImage(item)}
            >
              <svg
                className="w-6 h-6 text-white dark:text-gray-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <img
              src={item.prevUrl}
              className="rounded-lg w-full h-32 object-cover"
              alt="Foto do carro"
            />
          </div>
        ))}
      </div>

      <div className="w-full bg-white p-10 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative z-0 w-full mb-5 group">
            <Input
              type="text"
              name="name"
              register={register}
              error={errors.name?.message}
              placeholder="EX: Onix 1.0"
            />
            <label
              htmlFor="name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
            >
              Nome do carro
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <Input
              type="text"
              name="model"
              register={register}
              error={errors.model?.message}
              placeholder="EX: 1.0 manual"
            />
            <label
              htmlFor="model"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
            >
              Modelo
            </label>
          </div>

          <div className="flex flex-row w-full mb-3 gap-3">
            <div className="relative z-0 w-full mb-5 group">
              <Input
                type="text"
                name="year"
                register={register}
                error={errors.year?.message}
                placeholder="EX: 2019"
              />
              <label
                htmlFor="year"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
              >
                Ano
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <Input
                type="text"
                name="km"
                register={register}
                error={errors.km?.message}
                placeholder="EX: 290.000"
              />
              <label
                htmlFor="km"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
              >
                km rodados
              </label>
            </div>
          </div>

          <div className="flex flex-row w-full mb-3 gap-3">
            <div className="relative z-0 w-full mb-5 group">
              <Input
                type="text"
                name="whatsapp"
                register={register}
                error={errors.whatsapp?.message}
                placeholder="EX: 6712345678"
              />
              <label
                htmlFor="whatsapp"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
              >
                Contato / whatsapp
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <Input
                type="text"
                name="city"
                register={register}
                error={errors.city?.message}
                placeholder="EX: Corumbá"
              />
              <label
                htmlFor="city"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
              >
                Cidade
              </label>
            </div>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <Input
              type="text"
              name="price"
              register={register}
              error={errors.price?.message}
              placeholder="EX: R$300.000"
            />
            <label
              htmlFor="price"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
            >
              Preço
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <div className="mb-2 block ">
              <Label
                htmlFor="comment"
                value="Descrição"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
              />
            </div>
            <Textarea
              className="block py-2.3 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              id="comment"
              placeholder="Digite a descrição completa do carro"
              required
              rows={4}
              {...register("describe")}
            />
            {errors.describe && (
              <p className="mb-1 text-red-500">{errors.describe.message}</p>
            )}
          </div>

          {edit ? (
          <button
            type="submit"
            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-all"
          >
            Editar
          </button>
        ) : (
          <button
            type="submit"
            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-all"
          >
            Cadastrar
          </button>
        )}
        </form>
      </div>
    </Container>
  );
}
