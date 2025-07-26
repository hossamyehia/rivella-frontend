import { Routes, Route } from "react-router-dom";
import AdminRoute from "../../routes/AdminRoute";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";

export default function AdminPortal() {
    return (
        <Routes>
            <Route path="/" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/login" element={<AdminLogin />} />
        </Routes>
    );
}