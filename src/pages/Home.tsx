import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UseAuth from "../hooks/UseAuth";     

export default function Home() {
    const navigate = useNavigate(); 
    const session = UseAuth();
    useEffect(() => {
        if (!session) {
            navigate('/login');
        }
    }, [session]);
    return (
        <div className="home">
            <h1>Home</h1>
        </div>
    );
}