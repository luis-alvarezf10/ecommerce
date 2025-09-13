import { Routes, Route, Navigate } from "react-router-dom"
import Home from "../pages/Home";
import Admin from "../pages/Admin";
import SingUp from "../pages/SingUp";
import LogIn from "../pages/LogIn";
import AuthCallback from "../pages/AuthCallback";
import ProtectedRouter from "../routers/ProtectedRouter";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<ProtectedRouter><Home /></ProtectedRouter>} />
            <Route path="/admin" element={<ProtectedRouter><Admin /></ProtectedRouter>} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/singup" element={<SingUp />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
    );
};

export default AppRouter;
