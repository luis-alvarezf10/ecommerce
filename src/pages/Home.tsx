import ListProducts from "../components/home/ListProducts";
import Header from "../components/layout/Header";
import HeroSection from "../components/home/HeroSection";

export default function Home() {
    return (
        <div className="home">
            <Header />
            <HeroSection />
            <div data-products-section>
                <ListProducts />
            </div>
        </div>
    );
}