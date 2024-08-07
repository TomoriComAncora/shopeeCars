import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import { Container } from "../../Components/Container";
import { Input } from "../../Components/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "flowbite-react";

const schema = z.object({
  email: z
    .string()
    .email("Insira um email válido")
    .min(1, "Campo email é obrigatório"),
  password: z.string().min(5, "O campo senha deve ter no mínimo 5 carácteres"),
  name: z.string().min(1, "O campo nome é obrigatório"),
});

type FormData = z.infer<typeof schema>;

export function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to={"/"} className="mb-6 max-w-sm w-full">
          <img src={Logo} alt="logo do site" />
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

          <Button type="submit" className="bg-verdeMedio hover:verde">
            Acessar
          </Button>
        </form>

        <Link to={"/login"} className="text-white">
          Já possui conta? Faça o login!
        </Link>
      </div>
    </Container>
  );
}
