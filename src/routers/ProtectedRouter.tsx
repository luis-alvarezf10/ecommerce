import { Navigate } from "react-router-dom";
import UseAuth from "../hooks/UseAuth";

export default function ProtectedRouter({ children }: { children: React.ReactNode }) {
    const sesion = UseAuth();
    if (!sesion) {
        return <Navigate to="/login" />;
    } 
    return (
        <div>
            {children}
        </div>
    );
}