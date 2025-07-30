import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import FloatingTag from "./components/Social/floatingTag.component";
import WhatsApp from "./components/Social/whatsapp.component";
import { GlobalFilterProvider } from "../../shared/context/globalFilter.context";

export default function GeneralLayout() {
    return (
        <GlobalFilterProvider>
            <Header />
            <Outlet />
            <FloatingTag>
                <WhatsApp></WhatsApp>
            </FloatingTag>
            <Footer />
        </GlobalFilterProvider>
    );
}