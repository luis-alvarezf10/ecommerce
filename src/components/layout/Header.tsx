import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UseAuth from "../../hooks/UseAuth";
import { supabase } from "../../integrations/Supabase";
import { MdAccountCircle, MdAdminPanelSettings } from "react-icons/md";

export default function Header() {
    const navigate = useNavigate(); 
    const session = UseAuth();
    useEffect(() => {
        if (!session) {
            navigate('/login');
        }
    }, [session]);
    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                alert(error.message);
                return;
            }
            localStorage.removeItem('user');
            navigate('/login');
        } catch (error) {
            console.log(error);
            alert(error);       
        }
}

    return (
        <header className="bg-white text-black p-4 border-b border-gray-700 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
            <h1 className="text-2xl font-bold">Flowven</h1>
            <div className="flex items-center space-x-4">
                <button 
                    onClick={() => navigate('/admin')}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-2xl cursor-pointer"
                >                       
                    <MdAdminPanelSettings />
                </button>
                <button 
                    onClick={handleLogout}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors text-2xl cursor-pointer"
                >                       
                    <MdAccountCircle />
                </button>
            </div>
        </header>
    );
}