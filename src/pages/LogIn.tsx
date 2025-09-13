import { useNavigate } from "react-router-dom";
import React from "react";
import UseAuth from "../hooks/UseAuth";
import { useEffect } from "react";
import { supabase } from "../integrations/Supabase";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LogIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

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
        <div className="flex flex-col justify-center items-center min-h-screen gap-5 bg-[#0a1b34]">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl text-white font-bold text-center">FLOW VEN</h1>    
                <p className="text-gray-300 text-center ">Inicia sesión para continuar</p>
            </div>
            {loading && 
            <div role="status">
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
            }
            <div className="md:w-1/3 w-3/4 mx-auto flex flex-col gap-4 bg-white p-4 rounded-lg shadow-xl justify-center items-center">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-semibold text-center">Bienvenido</h2>
                    <p className="text-gray-600 text-center">Accede a tu cuenta</p>
                </div>
                <form className="flex flex-col gap-4 w-[90%]">
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" placeholder="tuemail@ejemplo.com" required onChange={(e) => setEmail(e.target.value)} className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">Contraseña</label>
                        <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password" 
                            placeholder="tucontraseña" 
                            required 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="border border-gray-300 rounded-lg p-2 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                        >
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>
                    </div>
                    <button type="button" onClick={handleSubmit} className="bg-[#0a1b34] cursor-pointer  mx-auto rounded-lg py-2 px-12 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-red-800 text-white font-semibold">Iniciar Sesión</button>
                </form>
                <button type="button" className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2 cursor-pointer">
                    <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
                    <path fill-rule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clip-rule="evenodd"/>
                    </svg>
                Iniciar Sesión con Google
                </button>
                <div className="flex flex-col md:flex-row md:gap-2 justify-center  text-center">
                    <span>¿No tienes una cuenta?</span>
                    <a onClick={() => navigate('/singup')} className="text-blue-500 hover:underline cursor-pointer">Registrate aquí</a>
                </div>
            </div>
            <div className="flex justify-center items-center">
                <p className="text-gray-500">© 2025 Flowven. Todos los derechos reservados.</p>
            </div>
        </div>
    );
}

export default LogIn;