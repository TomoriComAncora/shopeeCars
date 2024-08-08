import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/fbConect";

export function DashboardHeader() {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div
      className="w-full items-center flex h-10 bg-red-800 rounded-lg 
    font-medium text-white px-4 gap-4 mb-4"
    >
      <Link to={"/dashboard"}>Dashboard</Link>
      <Link to={"/dashboard/new"}>Cadastrar carro</Link>

      <button className="ml-auto" onClick={handleLogout}>
        Sair da conta
      </button>
    </div>
  );
}
