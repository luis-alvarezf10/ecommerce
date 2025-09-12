import { useNavigate } from "react-router-dom";
import { supabase } from "../integrations/Supabase";


export default function SingUp() {
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const password = formData.get('password') as string;
        console.log(name, email, phone, password);
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            alert(error.message);
            return;
        }
        setTimeout(() => {
            navigate('/home');
        }, 1000);
    }
    return (
        <div>
            <h1>Registrate Aquí!</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name ="name" placeholder="Nombre" />
                <input type="email" name="email" placeholder="Email" />
                <input type="text" name="phone" placeholder="Telefono" />
                <input type="password" name="password" placeholder="Contraseña" />
                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
}