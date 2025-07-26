import { Route, Routes } from "react-router-dom";
import Header from "../../components/layout/Header/Header";
import Footer from "../../components/layout/Footer/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import CitiesPage from './pages/CitiesPage';
import VillagesPage from "./pages/VillagesPage";
import Chalets from './pages/Chalets';
import ChaletDetails from './pages/ChaletDetails';
import Filter from './pages/Filter';
import Checkout from './pages/Checkout';
import ContactUs from './pages/ContactUs';

export default function GuestPortal() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/cities" element={<CitiesPage />} />
                <Route path="/villages" element={<VillagesPage />} />
                <Route path="/chalets" element={<Chalets />} />
                <Route path="/chalet/:id" element={<ChaletDetails />} />
                <Route path="/filter" element={<Filter />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/contact" element={<ContactUs />} />
            </Routes>
            <Footer />
        </>
    );
}
