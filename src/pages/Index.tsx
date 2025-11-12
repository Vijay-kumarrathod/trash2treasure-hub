import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import { Smartphone, Laptop, Home } from "lucide-react";
import heroImage from "@/assets/hero-ewaste.jpg";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 text-center text-white z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-primary drop-shadow-glow">Trash2Treasure</span>
          </h1>
          <p className="text-2xl md:text-4xl mb-8 font-semibold">
            Reimagine Recycling
          </p>
          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-gray-300">
            Turn your old electronics into treasure. Buy refurbished devices at amazing prices or sell your unused gadgets responsibly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/browse">
              <Button variant="hero" size="lg">
                Start Shopping
              </Button>
            </Link>
            <Link to="/sell">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-dark-bg">
                List Your Items
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Shop by <span className="text-primary">Category</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <CategoryCard
              icon={Smartphone}
              title="Phones"
              description="Discover refurbished smartphones at unbeatable prices. Quality guaranteed."
              link="/browse?category=phones"
            />
            <CategoryCard
              icon={Laptop}
              title="Laptops"
              description="Find powerful refurbished laptops perfect for work, study, or gaming."
              link="/browse?category=laptops"
            />
            <CategoryCard
              icon={Home}
              title="Appliances"
              description="Browse quality home appliances that are eco-friendly and affordable."
              link="/browse?category=appliances"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
