import { ApiContextProvider } from "./api.context";
import { UserContextProvider } from "./user.context";
import { GlobalFilterProvider } from "./globalFilter.context";
import { ServicesContextProvider } from "./services.context";

export default function AppContextProvider({ children }) {
    return (
        <ApiContextProvider>
            <UserContextProvider>
                    <ServicesContextProvider>
                        {children}
                    </ServicesContextProvider>
            </UserContextProvider>
        </ApiContextProvider>
    );
}