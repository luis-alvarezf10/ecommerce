import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserAuth from "../../hooks/UseAuth";
import { MdAdminPanelSettings, MdDashboard, MdLogout, MdShoppingCart, MdInventory, MdReceipt } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useCart } from "../../contexts/CartContext";
import Cart from "../cart/Cart";

export default function Header() {
    const navigate = useNavigate(); 
    const session = UserAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const { openCart, totalItems } = useCart();


    useEffect(() => {
        if (!session) {
            navigate('/login');
        } else {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            setUserEmail(user.email || 'usuario@flowven.com');
            console.log('User data:', user);
        }
    }, [session]);

    const logout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    }

    const goToAdmin = () => {
        navigate('/admin');
    }

    const goToInventory = () => {
        navigate('/inventory');
    }

    const goToOrders = () => {
        navigate('/orders');
    }

    const goToHome = () => {
        navigate('/home');
    }

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900 fixed top-0 left-0 right-0 z-50 shadow-sm">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/home" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white text-[#0a1b34]">FLOW VEN</span>
                </a>
                
                <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
                    <button
                        onClick={openCart}
                        className="p-2 text-gray-700 hover:text-gray-900 relative mr-2"
                        aria-label="Cart"
                    >
                        <MdShoppingCart className="w-6 h-6" />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </button>
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
                    >
                        <div className="w-8 h-8 rounded-full bg-[#0a1b34] flex items-center justify-center">
                            <FaUser className="text-white text-sm" />
                        </div>
                    </button>
                    
                    {isDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                            <div className="px-4 py-3 border-b">
                                <span className="block text-sm text-gray-900">Usuario</span>
                                <span className="block text-sm text-gray-500">{userEmail}</span>
                            </div>
                            <div className="py-2">
                                <button 
                                    onClick={goToHome}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <MdDashboard className="mr-2" />
                                    Inicio
                                </button>
                                <button 
                                    onClick={goToAdmin}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <MdAdminPanelSettings className="mr-2" />
                                    Agregar Producto
                                </button>
                                <button 
                                    onClick={goToInventory}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <MdInventory className="mr-2" />
                                    Gestionar Inventario
                                </button>
                                <button 
                                    onClick={goToOrders}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <MdReceipt className="mr-2" />
                                    Ver Compras
                                </button>
                                <button 
                                    onClick={logout}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    <MdLogout className="mr-2" />
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Cart />
        </nav>
    );
}