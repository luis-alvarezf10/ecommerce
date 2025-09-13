import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import Home from "../pages/Home";
import Admin from "../pages/Admin";
import Inventory from "../pages/Inventory";
import Orders from "../pages/Orders";
import SingUp from "../pages/SingUp";
import LogIn from "../pages/LogIn";
import AuthCallback from "../pages/AuthCallback";
import ProtectedRouter from "../routers/ProtectedRouter";
import Layout from "../components/layout/Layout";

const ProtectedLayout = () => (
  <ProtectedRouter>
    <Layout>
      <Outlet />
    </Layout>
  </ProtectedRouter>
);

const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes without layout */}
      <Route path="/login" element={<LogIn />} />
      <Route path="/singup" element={<SingUp />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Protected routes with layout */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/orders" element={<Orders />} />
      </Route>
      
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
};

export default AppRouter;
