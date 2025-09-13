import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/Supabase';

interface Category {
    id: number;
    name: string;
}

interface ProductForm {
    name: string;
    description: string;
    price: number;
    category_id: number;
    stock: number;
    image: File | null;
}

export default function Admin() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState<ProductForm>({
        name: '',
        description: '',
        price: 0,
        category_id: 0,
        stock: 0,
        image: null
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name');

            if (error) {
                console.error('Error fetching categories:', error);
                return;
            }

            setCategories(data || []);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' || name === 'category_id' ? Number(value) : value
        }));
    };

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category);
        setFormData(prev => ({
            ...prev,
            category_id: category.id
        }));
        setDropdownOpen(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({
            ...prev,
            image: file
        }));
    };

    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            console.log('Intentando subir archivo:', file.name, 'Tamaño:', file.size);
            
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            
            console.log('Nombre del archivo generado:', fileName);
            
            const { data, error } = await supabase.storage
                .from('products')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                console.error('Error detallado al subir imagen:', error);
                setMessage(`Error al subir imagen: ${error.message}`);
                return null;
            }

            console.log('Imagen subida exitosamente:', data);
            return fileName;
        } catch (error) {
            console.error('Error general al subir imagen:', error);
            setMessage(`Error inesperado al subir imagen: ${error}`);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            console.log('Iniciando proceso de creación de producto...');
            console.log('Datos del formulario:', formData);
            
            let imagePath = null;

            // Subir imagen si existe
            if (formData.image) {
                console.log('Subiendo imagen...');
                imagePath = await uploadImage(formData.image);
                if (!imagePath) {
                    console.log('Fallo en la subida de imagen');
                    setLoading(false);
                    return;
                }
                console.log('Imagen subida con éxito, path:', imagePath);
            } else {
                console.log('No hay imagen para subir');
            }

            // Insertar producto en la base de datos
            console.log('Insertando producto en la base de datos...');
            const { error } = await supabase
                .from('products')
                .insert([{
                    name: formData.name,
                    description: formData.description,
                    price: Number(formData.price),
                    category_id: formData.category_id,
                    stock: Number(formData.stock),
                    image_url: imagePath
                }]);

            if (error) {
                console.error('Error al insertar producto:', error);
                setMessage(`Error al crear producto: ${error.message}`);
                return;
            }

            console.log('Producto creado exitosamente');
            setMessage('Producto creado exitosamente!');
            
            // Limpiar formulario
            setFormData({
                name: '',
                description: '',
                price: 0,
                category_id: 0,
                stock: 0,
                image: null
            });
            setSelectedCategory(null);

            // Limpiar input de archivo
            const fileInput = document.getElementById('image') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

        } catch (error) {
            console.error('Error general:', error);
            setMessage(`Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <button
                    onClick={() => navigate('/home')}
                    className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver al Inicio
                </button>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                        <h1 className="text-3xl font-bold text-white">Panel de Administrador</h1>
                        <p className="text-blue-100 mt-2">Agregar nuevo producto al catálogo</p>
                    </div>
                    
                    <div className="p-8">
                        {message && (
                            <div className={`p-4 mb-6 rounded-lg border-l-4 ${message.includes('Error') ? 'bg-red-50 border-red-400 text-red-700' : 'bg-green-50 border-green-400 text-green-700'}`}>
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-sm font-medium">{message}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre del Producto
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        placeholder="Ingresa el nombre del producto"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Descripción
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                                        placeholder="Describe las características del producto"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                        Precio ($)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            min="0"
                                            step="0.01"
                                            required
                                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                                        Categoría
                                    </label>
                                    <button 
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="w-full px-4 py-3 text-left border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white hover:bg-gray-50" 
                                        type="button"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={selectedCategory ? 'text-gray-900' : 'text-gray-500'}>
                                                {selectedCategory ? selectedCategory.name : 'Selecciona una categoría'}
                                            </span>
                                            <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </button>

                                    {dropdownOpen && (
                                        <div className="absolute top-full left-0 z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                                            <ul className="py-1 max-h-60 overflow-auto">
                                                {categories.map(category => (
                                                    <li key={category.id}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCategorySelect(category)}
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                                        >
                                                            {category.name}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                                        Stock
                                    </label>
                                    <input
                                        type="number"
                                        id="stock"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        min="0"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        placeholder="Cantidad disponible"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                                    Imagen del Producto
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <label htmlFor="image" className="cursor-pointer">
                                        <div className="space-y-2">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="text-gray-600">
                                                <span className="font-medium text-blue-600 hover:text-blue-500">Haz clic para subir</span> o arrastra una imagen
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                                        </div>
                                    </label>
                                </div>
                                {formData.image && (
                                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-sm text-green-700 font-medium">
                                            ✓ Archivo seleccionado: {formData.image.name}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg transition-all duration-200 ${
                                        loading 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
                                    }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creando Producto...
                                        </div>
                                    ) : (
                                        'Crear Producto'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
