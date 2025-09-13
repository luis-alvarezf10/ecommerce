import { Navigate, useLocation } from "react-router-dom";
import UserAuth from "../hooks/UseAuth";

export default function ProtectedRouter({ children }: { 
    children: React.ReactNode;
}) {
    const session = UserAuth();
    const location = useLocation();
    
    if (!session) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    return <>{children}</>;
}