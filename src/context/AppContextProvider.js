import { ApiContextProvider } from "./ApiContext";
import { UserContextProvider } from "./UserContext";
import { MyContextProvider } from "./MyContext";
import { ServicesContextProvider } from "./ServicesContext";

export default function AppContextProvider({ children }) {
    return (
        <ApiContextProvider>
            <UserContextProvider>
                <MyContextProvider>
                    <ServicesContextProvider>
                        {children}
                    </ServicesContextProvider>
                </MyContextProvider>
            </UserContextProvider>
        </ApiContextProvider>
    );
}