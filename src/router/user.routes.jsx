import { lazy } from "react";

const ProfilePage = lazy(() => import("../features/profile/pages/Profile"));
const WishlistPage = lazy(() => import("../features/profile/pages/WishList"));

const userRoutes = [
  { path: "profile", element: <ProfilePage /> },
  { path: "wishlist", element: <WishlistPage />}
];

export default userRoutes;