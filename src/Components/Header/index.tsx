import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import { FiUser, FiLogIn } from "react-icons/fi";

export function Header() {
  const login = false;
  const loadAuth = false;

  return (
    <div className="w-full flex items-center justify-center h-16 bg-azulFraco drop-shadow mb-4">
      <header className="flex w-full max-w-7xl items-center justify-between px-4 mx-auto">
        <Link to={"/"}>
          <img src={Logo} alt="Logo do Site" className="h-16"/>
        </Link>
        {!loadAuth && login && (
          <Link to={"/dashboard"}>
            <div className="border-2 rounded-full p-1 border-gray-400">
              <FiUser size={24} color="#fff" />
            </div>
          </Link>
        )}
        {!loadAuth && !login && (
          <Link to={"/login"}>
            <div className="border-2 rounded-full p-1 border-gray-400">
              <FiLogIn size={24} color="#fff" />
            </div>
          </Link>
        )}
      </header>
    </div>
  );
}
