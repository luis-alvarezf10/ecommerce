import { useState, useEffect } from 'react';
import { supabase } from '../integrations/Supabase';
import Header from '../components/layout/Header';

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
        <div>
            <Header />
            <div className="flex flex-col p-6 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Panel de Administrador</h1>
                
                {message && (
                    <div className={`p-4 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="name">Nombre del Producto:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="border p-2 rounded"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="description">Descripción:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                            className="border p-2 rounded"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="price">Precio ($):</label>
                        <input
                            type="text"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                            required
                            className="border p-2 rounded"
                        />
                    </div>

                    <div className="flex flex-col relative">
                        <label htmlFor="category_id">Categoría:</label>
                        <button 
                            id="dropdownDefaultButton" 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between" 
                            type="button"
                        >
                            {selectedCategory ? selectedCategory.name : 'Selecciona una categoría'}
                            <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                            </svg>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute top-full left-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full border">
                                <ul className="py-2 text-sm text-gray-700">
                                    {categories.map(category => (
                                        <li key={category.id}>
                                            <button
                                                type="button"
                                                onClick={() => handleCategorySelect(category)}
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                            >
                                                {category.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="stock">Stock:</label>
                        <input
                            type="text"
                            id="stock"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            min="0"
                            required
                            className="border p-2 rounded"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="image">Imagen del Producto:</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border p-2 rounded"
                        />
                        {formData.image && (
                            <p className="text-sm text-gray-600 mt-1">
                                Archivo seleccionado: {formData.image.name}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`p-3 rounded text-white font-medium ${
                            loading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {loading ? 'Creando Producto...' : 'Crear Producto'}
                    </button>
                </form>
            </div>
        </div>
    );
}
