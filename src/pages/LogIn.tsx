import { useNavigate } from "react-router-dom";
import React from "react";
import UseAuth from "../hooks/UseAuth";
import { useEffect } from "react";
import { supabase } from "../integrations/Supabase";

const LogIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        const session = UseAuth();
        if (session) {
            navigate('/home');
        }
    }, []); 

    const handleSubmit = async () => {
        setLoading(true)
        try{
            console.log(email, password);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                alert(error.message);
                return;
            }
            if (data.user) {
                // para obtener el token de sesion
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/home');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            {loading && <p>Cargando...</p>}
            <h1>Login</h1>
            <form>
                <input type="email" name="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" name="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)}/>
                <button type="button" onClick={handleSubmit} className="bg-blue-500 cursor-pointer">Iniciar Sesion</button>
            </form>
            <span>¿No tienes una cuenta?</span>
            <a onClick={() => navigate('/singup')}>Registrarse</a>
        </div>
    );
}

export default LogIn;