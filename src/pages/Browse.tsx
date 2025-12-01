import { useEffect, useState } from "react";
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
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  // default static products used as fallback
  const defaultProducts = [
    {
      id: 101,
      images: [phoneImage],
      title: "Refurbished iPhone 17 Pro",
      price: 174900,
      condition: "Excellent",
      category: "phones",
      description: "A carefully refurbished iPhone with warranty."
    },
    {
      id: 102,
      images: [phoneImage],
      title: "Samsung Galaxy S21 Refurb",
      price: 25400,
      condition: "Excellent",
      category: "phones",
      description: "Well-maintained Samsung phone, recent battery replacement."
    },
    {
      id: 201,
      images: [laptopImage],
      title: "MacBook Air M1 Refurbished",
      price: 93900,
      condition: "Like New",
      category: "laptops",
      description: "Lightly used MacBook Air with M1 chip."
    },
    {
      id: 202,
      images: [laptopImage],
      title: "Dell XPS 13 Refurbished",
      price: 35600,
      condition: "Good",
      category: "laptops",
      description: "Dell XPS 13 with solid performance and good battery life."
    },
    {
      id: 301,
      images: [fridgeImage],
      title: "Samsung Smart Refrigerator",
      price: 25490,
      condition: "Good",
      category: "appliances",
      description: "Smart fridge in working condition."
    },
    {
      id: 302,
      images: [fridgeImage],
      title: "LG Smart Washer",
      price: 19999,
      condition: "Excellent",
      category: "appliances",
      description: "Efficient washer with multiple washing modes."
    },
  ];

  useEffect(() => {
    const fetchOrLoad = async () => {
      // try server first
      try {
        const res = await fetch("http://localhost:5000/items");
        if (res.ok) {
          const json = await res.json();
          const items = (json.items || []).map((it: any) => ({ ...it }));
          if (items.length) {
            setProducts(items);
            try { localStorage.setItem("items", JSON.stringify(items)); } catch(e) {}
            return;
          }
        }
      } catch (err) {
        // ignore network errors, fallback to localStorage or defaults
      }

      // try localStorage
      try {
        const raw = localStorage.getItem("items");
        if (raw) {
          const items = JSON.parse(raw);
          if (Array.isArray(items) && items.length) {
            setProducts(items);
            return;
          }
        }
      } catch (e) {
        // ignore
      }

      // final fallback to defaults
      setProducts(defaultProducts);
      try { localStorage.setItem("items", JSON.stringify(defaultProducts)); } catch(e) {}
    };
    fetchOrLoad();
  }, []);

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
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="phones">Phones</SelectItem>
                    <SelectItem value="laptops">Laptops</SelectItem>
                    <SelectItem value="appliances">Appliances</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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
            {products
              .filter((product) => {
                // category filter
                if (selectedCategory && selectedCategory !== "all") {
                  if (!product.category) return false;
                  if (String(product.category).toLowerCase() !== String(selectedCategory).toLowerCase()) return false;
                }

                // search filter (title or description)
                if (searchTerm) {
                  const q = searchTerm.toLowerCase();
                  const inTitle = String(product.title || "").toLowerCase().includes(q);
                  const inDesc = String(product.description || "").toLowerCase().includes(q);
                  return inTitle || inDesc;
                }

                return true;
              })
              .map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.images?.[0] ?? phoneImage}
                title={product.title}
                price={Number(product.price) || 0}
                condition={product.condition}
                category={product.category}
                description={product.description}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Browse;
