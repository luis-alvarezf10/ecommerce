import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/Supabase';
import { MdArrowBack } from 'react-icons/md';

interface Order {
    id: string;
    total_amount: number;
    status: string;
    created_at: string;
    order_items: {
        quantity: number;
        price: number;
        products: {
            name: string;
            image_url: string;
        };
    }[];
}

export default function Orders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (
                        quantity,
                        price,
                        products (
                            name,
                            image_url
                        )
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            // Procesar URLs de imágenes
            const ordersWithImageUrls = data?.map(order => ({
                ...order,
                order_items: order.order_items.map((item: any) => ({
                    ...item,
                    products: {
                        ...item.products,
                        image_url: item.products.image_url 
                            ? supabase.storage.from('products').getPublicUrl(item.products.image_url).data.publicUrl
                            : 'https://via.placeholder.com/300x200?text=Sin+Imagen'
                    }
                }))
            }));
            
            setOrders(ordersWithImageUrls || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <button
                    onClick={() => navigate('/home')}
                    className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <MdArrowBack className="w-5 h-5 mr-2" />
                    Volver al Inicio
                </button>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
                        <h1 className="text-3xl font-bold text-white">Historial de Compras</h1>
                        <p className="text-purple-100 mt-2">Todas las compras realizadas</p>
                    </div>

                    <div className="p-8">
                        {orders.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No hay compras registradas</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Pedido #{order.id}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {formatDate(order.created_at)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-green-600">
                                                    ${order.total_amount.toFixed(2)}
                                                </p>
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="border-t pt-4">
                                            <h4 className="font-medium text-gray-900 mb-3">Productos:</h4>
                                            <div className="space-y-2">
                                                {order.order_items.map((item, index) => (
                                                    <div key={index} className="flex items-center justify-between py-2">
                                                        <div className="flex items-center">
                                                            <img 
                                                                src={item.products.image_url} 
                                                                alt={item.products.name}
                                                                className="h-16 w-16 rounded-lg object-cover mr-3"
                                                            />
                                                            <span className="text-sm text-gray-900">
                                                                {item.products.name}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {item.quantity} x ${item.price.toFixed(2)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}