import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Grid, List } from "lucide-react";
import phoneImage from "@/assets/product-phone.jpg";
import laptopImage from "@/assets/product-laptop.jpg";
import fridgeImage from "@/assets/product-fridge.jpg";

const Browse = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const products = [
    {
      id: 1,
      image: phoneImage,
      title: "Refurbished iPhone 12 Pro",
      price: 599,
      condition: "Excellent",
      category: "Phones"
    },
    {
      id: 2,
      image: laptopImage,
      title: "MacBook Air M1 Refurbished",
      price: 849,
      condition: "Like New",
      category: "Laptops"
    },
    {
      id: 3,
      image: fridgeImage,
      title: "Samsung Smart Refrigerator",
      price: 799,
      condition: "Good",
      category: "Appliances"
    },
    {
      id: 4,
      image: phoneImage,
      title: "Samsung Galaxy S21 Refurb",
      price: 449,
      condition: "Excellent",
      category: "Phones"
    },
    {
      id: 5,
      image: laptopImage,
      title: "Dell XPS 13 Refurbished",
      price: 699,
      condition: "Good",
      category: "Laptops"
    },
    {
      id: 6,
      image: fridgeImage,
      title: "LG Smart Washer",
      price: 499,
      condition: "Excellent",
      category: "Appliances"
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Browse Products</h1>
          
          {/* Filters */}
          <div className="bg-card rounded-lg shadow-card p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search products..." 
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="phones">Phones</SelectItem>
                    <SelectItem value="laptops">Laptops</SelectItem>
                    <SelectItem value="appliances">Appliances</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{products.length} products found</span>
                <div className="flex gap-2">
                  <Button 
                    variant={viewMode === "grid" ? "default" : "outline"} 
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewMode === "list" ? "default" : "outline"} 
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Browse;
