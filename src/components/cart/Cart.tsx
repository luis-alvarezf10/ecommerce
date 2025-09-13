import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/format';
import { supabase } from '../../integrations/Supabase';

const Cart: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    totalPrice,
  } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      console.log('Iniciando proceso de pago...');
      console.log('Items en carrito:', items);
      console.log('Total:', totalPrice);
      
      // Obtener usuario actual
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error obteniendo usuario:', userError);
        throw userError;
      }
      if (!user) {
        console.error('Usuario no autenticado');
        throw new Error('Usuario no autenticado');
      }
      console.log('Usuario obtenido:', user.id);
      
      // Crear la orden
      console.log('Creando orden...');
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalPrice,
          status: 'completed'
        })
        .select()
        .single();
      
      if (orderError) {
        console.error('Error creando orden:', orderError);
        throw orderError;
      }
      console.log('Orden creada:', order);
      
      // Crear los items de la orden y actualizar stock
      for (const item of items) {
        console.log('Procesando item:', item);
        
        // Insertar item de la orden
        const { error: itemError } = await supabase
          .from('order_items')
          .insert({
            order_id: order.id,
            product_id: parseInt(item.id),
            quantity: item.quantity,
            price: item.price
          });
        
        if (itemError) {
          console.error('Error insertando item:', itemError);
          throw itemError;
        }
        console.log('Item insertado correctamente');
        
        // Obtener stock actual
        const { data: product, error: fetchError } = await supabase
          .from('products')
          .select('stock')
          .eq('id', parseInt(item.id))
          .single();
        
        if (fetchError) {
          console.error('Error obteniendo producto:', fetchError);
          throw fetchError;
        }
        console.log('Stock actual del producto:', product.stock);
        
        // Actualizar stock
        const newStock = Math.max(0, (product.stock || 0) - item.quantity);
        console.log('Nuevo stock:', newStock);
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', parseInt(item.id));
        
        if (updateError) {
          console.error('Error actualizando stock:', updateError);
          throw updateError;
        }
        console.log('Stock actualizado correctamente');
      }
      
      // Limpiar carrito
      items.forEach(item => removeFromCart(item.id));
      
      // Mostrar mensaje de éxito
      alert(`¡Su compra ha sido efectuada exitosamente! Número de orden: ${order.id}`);
      
      // Cerrar carrito
      closeCart();
      
    } catch (error) {
      console.error('Error completo:', error);
      alert(`Error: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 overflow-hidden">
        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-auto">
          <div className="w-screen max-w-md">
            <div className="flex h-full flex-col bg-white shadow-xl">
              <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Carrito de compras</h2>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={closeCart}
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mt-8">
                  {items.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Carrito vacío</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Comienza a agregar productos a tu carrito.
                      </p>
                    </div>
                  ) : (
                    <div className="flow-root">
                      <ul className="-my-6 divide-y divide-gray-200">
                        {items.map((item) => (
                          <li key={item.id} className="flex py-6">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              {item.imageUrl && (
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="h-full w-full object-cover object-center"
                                />
                              )}
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{item.name}</h3>
                                  <p className="ml-4">{formatPrice(item.price)}</p>
                                </div>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <div className="flex items-center border border-gray-300 rounded-md">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                  >
                                    <Minus size={16} />
                                  </button>
                                  <span className="px-3">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  className="font-medium text-indigo-600 hover:text-indigo-500"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {items.length > 0 && (
                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Total</p>
                    <p>{formatPrice(totalPrice)}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Envío e impuestos calculados al finalizar la compra.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className={`flex w-full items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm ${
                        isProcessing 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Procesando...
                        </div>
                      ) : (
                        'Pagar'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
