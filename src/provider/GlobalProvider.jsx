import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react"; // Import OrderProvider
import { AuthProvider } from "../context/AuthContext";
import { RegisterProvider } from "../context/RegisterContext";

const GlobalProvider = ({ children }) => {


  return (

      <BrowserRouter>
        <AuthProvider>
          <RegisterProvider>
            {children}
          </RegisterProvider>
        </AuthProvider>
      </BrowserRouter>

  );
};

export default GlobalProvider;
