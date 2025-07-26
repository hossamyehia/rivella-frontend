import { Route, Routes } from "react-router-dom";
import Header from "../../components/layout/Header/Header";
import Footer from "../../components/layout/Footer/Footer";
import WishlistPage from "./pages/WishList";
import ProfilePage from "./pages/Profile";
import { ForgetPassword } from "./pages/ForgetPassword";
import { ResetPassword } from "./pages/ResetPassword";

export default function UserPortal() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/forget-password" element={<ForgetPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
            <Footer />
        </>
    );
}