import { useEffect, useState } from 'react';
import { supabase } from '../../integrations/Supabase';
import { FaThLarge, FaThList } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price?: number;
    image_url: string;
    category_id: number;
    stock?: number;
    created_at?: string;
    categories?: Category;
}

export default function ListProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSingleColumn, setIsSingleColumn] = useState(false);
    const { addToCart } = useCart();

    const handleAddToCart = (product: Product) => {
        addToCart({
            id: product.id.toString(),
            name: product.name,
            price: product.price || 0,
            imageUrl: product.image_url
        });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    categories (
                        id,
                        name
                    )
                `)
                .gt('stock', 0)
                .order('created_at', { ascending: false });

            if (error) {
                setError(error.message);
                return;
            }

            console.log('Productos desde la base de datos:', data);
            
            // Construir URLs del bucket para las imágenes
            const productsWithImageUrls = data?.map(product => ({
                ...product,
                image_url: product.image_url 
                    ? supabase.storage.from('products').getPublicUrl(product.image_url).data.publicUrl
                    : 'https://via.placeholder.com/300x200?text=Sin+Imagen'
            }));
            
            setProducts(productsWithImageUrls || []);
        } catch (err) {
            setError('Error al cargar los productos');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="ml-4 text-gray-600">Cargando productos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error al cargar productos</h3>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                </div>
                <button 
                    onClick={fetchProducts}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
                <p className="mt-1 text-sm text-gray-500">Agrega algunos productos para verlos aquí</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Productos Disponibles</h2>
                    <p className="text-gray-600">Descubre nuestra colección de productos</p>
                </div>
                
                {/* Mobile Column Toggle Button */}
                <div className="sm:hidden flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setIsSingleColumn(false)}
                        className={`p-2 rounded-md ${!isSingleColumn ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                        aria-label="Dos columnas"
                    >
                        <FaThList className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => setIsSingleColumn(true)}
                        className={`p-2 rounded-md ${isSingleColumn ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                        aria-label="Una columna"
                    >
                        <FaThLarge className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            <div className={`grid ${isSingleColumn ? 'grid-cols-1' : 'grid-cols-2'} sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6`}>
                {products.map((product) => (
                    <div key={product.id} className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full ${
                        !isSingleColumn ? 'border border-gray-100' : ''
                    }`}>
                        <div className="relative flex-shrink-0">
                            <div className="aspect-w-1 aspect-h-1 w-full">
                                <img 
                                    src={product.image_url} 
                                    alt={product.name}
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
                                    }}
                                    className="w-full h-40 sm:h-48 object-cover"
                                />
                            </div>
                            {product.categories && (
                                <div className="absolute top-2 left-2">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-white/90 text-gray-800 shadow-sm">
                                        {product.categories.name}
                                    </span>
                                </div>
                            )}
                            {product.stock !== undefined && product.stock < 10 && product.stock > 0 && (
                                <div className="absolute top-2 right-2">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-100/90 text-yellow-800 shadow-sm">
                                        Casi agotado
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1 h-6 overflow-hidden text-ellipsis">
                                {product.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
                                {product.description}
                            </p>
                            <div className="mt-auto">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-base font-bold text-blue-600">
                                        {product.price ? `$${product.price.toFixed(2)}` : 'Precio no disponible'}
                                    </span>
                                    {product.stock === 0 && (
                                        <span className="text-xs text-red-600 font-medium">Agotado</span>
                                    )}
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => handleAddToCart(product)}
                                disabled={product.stock === 0}
                                className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                                    product.stock === 0 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 active:scale-95 shadow-sm hover:shadow-md'
                                }`}
                            >
                                {product.stock === 0 ? (
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Agotado
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Agregar
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}