import { useState, useEffect } from 'react';
import unoImg from '../../assets/images/uno.png';
import dosImg from '../../assets/images/dos.png';
import tresImg from '../../assets/images/tres.png';

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const slides = [
        {
            title: "Descubre nuestra colección",
            subtitle: "Encuentra productos únicos y de calidad",
            description: "Explora nuestra colección exclusiva con los mejores precios del mercado",
            buttonText: "Explorar Productos",
            backgroundImage: unoImg,
            fallbackColor: "bg-gradient-to-br from-blue-600 to-purple-700"
        },
        {
            title: "Camina con Flow",
            subtitle: "Hasta 50% de descuento",
            description: "No te pierdas nuestras ofertas limitadas en productos seleccionados",
            buttonText: "Ver Ofertas",
            backgroundImage: dosImg,
            fallbackColor: "bg-gradient-to-br from-green-600 to-teal-700"
        },
        {
            title: "Calidad Premium",
            subtitle: "Productos cuidadosamente seleccionados",
            description: "Cada producto pasa por un riguroso control de calidad",
            buttonText: "Conocer Más",
            backgroundImage: tresImg,
            fallbackColor: "bg-gradient-to-br from-purple-600 to-pink-700"
        }
    ];

    useEffect(() => {
        console.log('Current slide images:', slides.map(s => s.backgroundImage));
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [slides.length]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const scrollToProducts = () => {
        const productsSection = document.querySelector('[data-products-section]');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="relative h-[400px] sm:h-[500px] overflow-hidden">
            {/* Slides */}
            <div className="relative h-full">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-700 ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    >
                        <div className={`absolute inset-0 ${slide.fallbackColor} flex items-center`}>
                            <div className="absolute inset-0 bg-black/10 sm:bg-transparent z-0"></div>
                            <div className="container mx-auto px-4 sm:px-6 z-10 relative">
                                <div className="max-w-md sm:max-w-lg">
                                    <span className="text-xs sm:text-sm font-medium text-white bg-black/30 px-3 py-1 rounded-full mb-3 sm:mb-4 inline-block">
                                        {slide.subtitle}
                                    </span>
                                    <h1 className="md:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                                        {slide.title}
                                    </h1>
                                    <p className="text-sm sm:text-base text-gray-100 mb-6 sm:mb-8 line-clamp-2 sm:line-clamp-none">
                                        {slide.description}
                                    </p>
                                    <button 
                                        className="bg-white text-blue-600 hover:bg-gray-100 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium transition-all active:scale-95 text-sm sm:text-base"
                                        onClick={scrollToProducts}
                                    >
                                        {slide.buttonText}
                                    </button>
                                </div>
                            </div>
                            <div className="absolute right-0 top-0 w-full h-full sm:w-1/2 sm:top-1/2 sm:-translate-y-1/2">
                                <div className="relative w-full h-full">
                                    <img
                                        src={slide.backgroundImage}
                                        alt=""
                                        className="w-full h-full object-cover object-center"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                        }}
                                    />
                                    {/* Gradient overlay for better text visibility on mobile */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:bg-none"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                            index === currentSlide ? 'bg-white w-6 sm:w-8' : 'bg-white/50'
                        }`}
                        aria-label={`Ir a diapositiva ${index + 1}`}
                    />
                ))}
            </div>

            {/* Navigation Arrows - Hidden on mobile */}
            <button
                onClick={() => goToSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)}
                className="hidden sm:block absolute left-4 top-1/2 transform -translate-y-1/2 z-40 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300"
                aria-label="Anterior"
            >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={() => goToSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1)}
                className="hidden sm:block absolute right-4 top-1/2 transform -translate-y-1/2 z-40 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300"
                aria-label="Siguiente"
            >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}
