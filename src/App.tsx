import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./Components/Layout";
import { Cars } from "./pages/cars";
import { Dashboard } from "./pages/dashboard";
import { New } from "./pages/dashboard/new";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Register } from "./pages/register";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/cars/:id",
        element: <Cars />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/new",
        element: <New />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export { router };
