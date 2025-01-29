import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react"; // Import OrderProvider
import { AuthProvider } from "../context/AuthContext";
import { RegisterProvider } from "../context/RegisterContext";
import { RolProvider } from "../context/RolContext";
import { UserProvider } from "../context/UserContext";
import { AlumnoProvider } from "../context/AlumnoContext";
import { DocenteProvider } from "../context/DocenteContext";
import { CursoProvider } from "../context/CursoContext";

const GlobalProvider = ({ children }) => {


  return (

      <BrowserRouter>
        <AuthProvider>
          <RegisterProvider>
            <RolProvider>
              <UserProvider>
                <AlumnoProvider>
                  <DocenteProvider>
                    <CursoProvider>
                      {children}
                    </CursoProvider>
                  </DocenteProvider>
                </AlumnoProvider>
              </UserProvider>              
            </RolProvider>
          </RegisterProvider>
        </AuthProvider>
      </BrowserRouter>

  );
};

export default GlobalProvider;
