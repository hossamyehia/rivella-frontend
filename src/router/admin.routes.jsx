import { lazy } from "react";

const AdminDashBoard = lazy(() => import("../features/dashboard/AdminDashboard"));
const UsersManage = lazy(() => import("../features/dashboard/UsersManage/UsersManage"));
const AdminsManage = lazy(() => import("../features/dashboard/AdminsManage/AdminsManage"));
const CitiesManage = lazy(() => import("../features/dashboard/CitiesManage/CitiesManage"));
const VillagesManage = lazy(() => import("../features/dashboard/VillagesManage/VillagesManage"));
const FeaturesManage = lazy(() => import("../features/dashboard/FeaturesManage/FeaturesManage"));
const ServicesManage = lazy(() => import("../features/dashboard/ServicesManage/ServicesManage"));
const TermsManage = lazy(() => import("../features/dashboard/TermsManage/TermsManage"));
const ChaletsManage = lazy(() => import("../features/dashboard/ChaletsManage/ChaletsManage"));
const CouponsManage = lazy(() => import("../features/dashboard/CouponsManage/CouponsManage"));
const BookingsManage = lazy(() => import("../features/dashboard/BookingsManage/BookingsManage"));
const ReservationsManage = lazy(() => import("../features/dashboard/ReservationsManage/ReservationsManage"));
const NotFound = lazy(() => import("../features/public/pages/NotFound"));

const adminRoutes = [
    { index: true, element: <AdminDashBoard /> }, // default/dashboard
    { path: 'users', element: <UsersManage /> },
    { path: 'admins', element: <AdminsManage /> },
    { path: 'cities', element: <CitiesManage /> },
    { path: 'villages', element: <VillagesManage /> },
    { path: 'features', element: <FeaturesManage /> },
    { path: 'services', element: <ServicesManage /> },
    { path: 'terms', element: <TermsManage /> },
    { path: 'chalets', element: <ChaletsManage /> },
    { path: 'coupons', element: <CouponsManage /> },
    { path: 'bookings', element: <BookingsManage /> },
    { path: 'reservations', element: <ReservationsManage /> },
    { path: '*', element: <NotFound /> },
];

export default adminRoutes;