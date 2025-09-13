import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routers/AppRouter';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    // cambios
    <BrowserRouter>
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
