// agora foi, só fazer nesse as alterações e dar o commit, vai aparecer pra mim aceitar
//
import { ReactNode, useContext } from "react";
import { AuthContext } from "../contexts/AuthContexts";
import { Navigate } from "react-router-dom";

interface PrivateProps {
  children: ReactNode;
}

export function Private({ children }: PrivateProps): any {
  const { signed, loadingAuth } = useContext(AuthContext);

  if (loadingAuth) {
    return <div></div>;
  }

  if (!signed) {
    return <Navigate to={"/login"} />;
  }

  return children;
}