import { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "../../Components/Container";
import { Input } from "../../Components/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthContext } from "../../contexts/AuthContexts";
import { auth } from "../../services/fbConect";
import Logo from "../../assets/Logo.png";
import {createUserWithEmailAndPassword, signOut, updateProfile} from "firebase/auth";

const schema = z.object({
  email: z
    .string()
    .email("Insira um email válido")
    .min(1, "Email é obrigatório"),
  password: z.string().min(6, "A senha deve ter no mínimo 4 carácteres"),
  name: z.string().min(1, "O campo nome é obrigatório"),
});

type FormData = z.infer<typeof schema>;

export function Register() {
  const {handleInfoUser} = useContext(AuthContext)
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    const handleLogout = async () => {
      await signOut(auth);
    };

    handleLogout();
  }, []);

  const onSubmit = async (data: FormData) => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (user) => {
        await updateProfile(user.user, {
          displayName: data.name,
        });
        handleInfoUser({
          name: data.name,
          email: data.email,
          uid: user.user.uid,
        });
        console.log("Usuario cadastrado com sucesso");
        navigate("/dashboard", { replace: true });
      })
      .catch((err) => {
        console.log("Erro ao cadastra esse usuário");
        console.log(err);
      });
  };

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to={"/"} className="mb-6 max-w-sm w-full">
          <img src={Logo} alt="logo do site" className="w-full" />
        </Link>

        <form
          className="bg-white max-w-xl w-full rounded-lg p-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <Input
              type="text"
              placeholder="Digite seu nome"
              name="name"
              error={errors.name?.message}
              register={register}
            />
          </div>
          <div className="mb-3">
            <Input
              type="text"
              placeholder="Digite seu email"
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>
          <div className="mb-3">
            <Input
              type="password"
              placeholder="Digite sua senha"
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>
          <button
            type="submit"
            className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium"
          >
            Cadastrar
          </button>
        </form>

        <Link 
        className="bg-grey text-white"
        to={"/login"}>Já possui conta? Faça o login!</Link>
      </div>
    </Container>
  );
};
