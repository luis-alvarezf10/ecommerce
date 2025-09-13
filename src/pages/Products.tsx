import React from 'react';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/products/ProductCard';

// Sample product data - in a real app, this would come from an API
const sampleProducts = [
  {
    id: '1',
    name: 'Producto 1',
    description: 'Descripción del producto 1 con características destacadas.',
    price: 299.99,
    imageUrl: 'https://via.placeholder.com/300x200?text=Product+1',
  },
  {
    id: '2',
    name: 'Producto 2',
    description: 'Descripción del producto 2 con características destacadas.',
    price: 199.99,
    imageUrl: 'https://via.placeholder.com/300x200?text=Product+2',
  },
  {
    id: '3',
    name: 'Producto 3',
    description: 'Descripción del producto 3 con características destacadas.',
    price: 399.99,
    imageUrl: 'https://via.placeholder.com/300x200?text=Product+3',
  },
  {
    id: '4',
    name: 'Producto 4',
    description: 'Descripción del producto 4 con características destacadas.',
    price: 499.99,
    imageUrl: 'https://via.placeholder.com/300x200?text=Product+4',
  },
];

const Products: React.FC = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (
    product: { id: string; name: string; price: number; imageUrl?: string },
    quantity: number
  ) => {
    console.log('handleAddToCart called with:', { product, quantity });
    // Create a cart item without the quantity
    const { id, name, price, imageUrl } = product;
    console.log('Calling addToCart with:', { id, name, price, imageUrl });
    
    // Call addToCart once with the specified quantity
    // The cart context will handle incrementing the quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({ id, name, price, imageUrl });
    }
    
    console.log('Cart should be updated now');
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Nuestros Productos
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {sampleProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              imageUrl={product.imageUrl}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
