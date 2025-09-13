import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UseAuth from "../../hooks/UseAuth";
import { supabase } from "../../integrations/Supabase";
import { MdAdminPanelSettings, MdDashboard, MdSettings, MdLogout } from "react-icons/md";
import { FaUser } from "react-icons/fa";

export default function Header() {
    const navigate = useNavigate(); 
    const session = UseAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        if (!session) {
            navigate('/login');
        } else {
            // Get user email from session or localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            setUserEmail(user.email || 'usuario@flowven.com');
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

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdown = document.getElementById('user-dropdown');
            const button = document.getElementById('user-menu-button');
            if (dropdown && button && !dropdown.contains(event.target as Node) && !button.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900 fixed top-0 left-0 right-0 z-50 shadow-sm">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/home" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white text-[#0a1b34]">FLOW VEN</span>
                </a>
                
                <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    <button 
                        type="button" 
                        className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 cursor-pointer" 
                        id="user-menu-button" 
                        aria-expanded={isDropdownOpen}
                        onClick={toggleDropdown}
                    >
                        <span className="sr-only">Open user menu</span>
                        <div className="w-8 h-8 rounded-full bg-[#0a1b34] flex items-center justify-center">
                            <FaUser className="text-white text-sm" />
                        </div>
                    </button>
                    
                    {/* Dropdown menu */}
                    <div 
                        className={`z-50 ${isDropdownOpen ? 'block' : 'hidden'} absolute top-12 right-0 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600`}
                        id="user-dropdown"
                    >
                        <div className="px-4 py-3">
                            <span className="block text-sm text-gray-900 dark:text-white">Usuario</span>
                            <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{userEmail}</span>
                        </div>
                        <ul className="py-2" aria-labelledby="user-menu-button">
                            <li>
                                <button 
                                    onClick={() => {navigate('/home'); setIsDropdownOpen(false);}}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                >
                                    <MdDashboard className="mr-2" />
                                    Dashboard
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => {navigate('/admin'); setIsDropdownOpen(false);}}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                >
                                    <MdAdminPanelSettings className="mr-2" />
                                    Admin Panel
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => {setIsDropdownOpen(false);}}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                >
                                    <MdSettings className="mr-2" />
                                    Configuración
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => {handleLogout(); setIsDropdownOpen(false);}}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-400 dark:hover:text-white"
                                >
                                    <MdLogout className="mr-2" />
                                    Cerrar Sesión
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}