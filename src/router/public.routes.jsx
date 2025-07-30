import { lazy } from "react";
import Home from "../features/public/pages/Home";

// const Home = lazy(() => import("../features/public/pages/Home"));
const Login = lazy(() => import("../features/auth/pages/Login"));
const AdminLogin = lazy(() => import("../features/auth/pages/AdminLogin"));
const Register = lazy(() => import("../features/auth/pages/Register"));
const VerifyEmail = lazy(() => import("../features/auth/pages/VerifyEmail"));
const ForgetPassword = lazy(() => import("../features/auth/pages/ForgetPassword"));
const ResetPassword = lazy(() => import("../features/auth/pages/ResetPassword"));
const CitiesPage = lazy(() => import("../features/public/pages/CitiesPage"));
const VillagesPage = lazy(() => import("../features/public/pages/VillagesPage"));
const Chalets = lazy(() => import("../features/public/pages/Chalets"));
const ChaletDetails = lazy(() => import("../features/public/pages/ChaletDetails"));
const Filter = lazy(() => import("../features/public/pages/Filter"));
const Checkout = lazy(() => import("../features/public/pages/Checkout"));
const ContactUs = lazy(() => import("../features/public/pages/ContactUs"));
const NotFound = lazy(() => import("../features/public/pages/NotFound"));

const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/register", element: <Register /> },
  { path: "/verify-email", element: <VerifyEmail /> },
  { path: "/forget-password", element: <ForgetPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/cities", element: <CitiesPage /> },
  { path: "/villages", element: <VillagesPage /> },
  { path: "/chalets", element: <Chalets /> },
  { path: "/chalet/:id", element: <ChaletDetails /> },
  { path: "/filter", element: <Filter /> },
  { path: "/checkout", element: <Checkout /> },
  { path: "/contact", element: <ContactUs /> },
  { path: "*", element: <NotFound /> },
];

export default publicRoutes;