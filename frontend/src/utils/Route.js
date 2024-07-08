import useAuth from "../hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export function PrivateRoute () {
    const { accessToken } = useAuth()
    const location = useLocation()

    return (accessToken ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />)
};