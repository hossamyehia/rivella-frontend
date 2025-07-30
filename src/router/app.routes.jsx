import { BrowserRouter, Route, Routes } from "react-router-dom";
import GeneralLayout from "../layouts/GeneralLayout/generalLayout.layout";
import AdminLayout from "../layouts/AdminLayout/admin.layout";
import AdminGuard from "../shared/guards/admin.guard";
import publicRoutes from "./public.routes";
import adminRoutes from "./admin.routes";
import userRoutes from "./user.routes";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<GeneralLayout />}>
                    {publicRoutes.map((route) => <Route {...route} />)}
                </Route>

                <Route path="/user" element={<GeneralLayout />}>
                    {userRoutes.map((route) => <Route {...route} />)}
                </Route>

                <Route element={<AdminGuard />}>
                    <Route path="/dashboard" element={<AdminLayout />}>
                        {adminRoutes.map((route) => <Route {...route} />)}
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}