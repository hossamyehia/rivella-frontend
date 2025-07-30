import { Suspense } from "react";
import Loader from "../shared/components/Loader";
import AppRouter from "./app.routes";


export default function Router() {
    return (
        <Suspense fallback={<Loader />}>
            <AppRouter />
        </Suspense>
    )
}