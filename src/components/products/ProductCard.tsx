import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { formatPrice } from '../../utils/format';
import ProductModal from './ProductModal';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  onAddToCart: (product: { id: string; name: string; price: number; imageUrl?: string }, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  description,
  imageUrl,
  onAddToCart,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div 
          className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-64 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover object-center sm:h-full sm:w-full"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col space-y-2 p-4">
          <h3 className="text-sm font-medium text-gray-900">
            <button onClick={() => setIsModalOpen(true)} className="text-left">
              <span aria-hidden="true" className="absolute inset-0" />
              {name}
            </button>
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
          <div className="flex flex-1 flex-col justify-end">
            <p className="text-sm italic text-gray-500">
              {formatPrice(price)}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart({ id, name, price, imageUrl }, 1);
            }}
            className="mt-2 w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Agregar al carrito
          </button>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{ id, name, price, description, imageUrl }}
        onAddToCart={onAddToCart}
      />
    </>
  );
};

export default ProductCard;
