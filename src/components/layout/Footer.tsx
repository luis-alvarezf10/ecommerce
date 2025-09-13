import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaCcVisa, FaCcMastercard, FaCcPaypal } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Sobre Nosotros</h3>
            <p className="text-gray-400">
              Tu tienda en línea de confianza para encontrar los mejores productos a precios increíbles.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Inicio</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors">Productos</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Sobre Nosotros</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contacto</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-bold mb-4">Servicio al Cliente</h3>
            <ul className="space-y-2">
              <li><Link to="/shipping" className="text-gray-400 hover:text-white transition-colors">Envíos</Link></li>
              <li><Link to="/returns" className="text-gray-400 hover:text-white transition-colors">Devoluciones</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Política de Privacidad</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Términos y Condiciones</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <address className="not-italic text-gray-400 space-y-2">
              <p>123 Calle Principal</p>
              <p>Ciudad, CP 12345</p>
              <p>Email: info@mitienda.com</p>
              <p>Tel: (123) 456-7890</p>
            </address>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <span className="text-gray-400">Aceptamos:</span>
              <div className="flex space-x-2">
                <FaCcVisa size={28} className="text-gray-400" />
                <FaCcMastercard size={28} className="text-gray-400" />
                <FaCcPaypal size={28} className="text-gray-400" />
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Mi Tienda. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
