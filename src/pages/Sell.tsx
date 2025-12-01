import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Camera, MapPin, Lightbulb, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Sell = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [sellerContact, setSellerContact] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) {
        navigate("/login");
        return;
      }
      const user = JSON.parse(raw);
      setSellerName(user.name || "");
      setSellerContact(user.contact || "");
    } catch (e) {
      navigate("/login");
    }
  }, [navigate]);
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selected = e.target.files;
  if (!selected) return;
  // limit to 5
  if (selected.length > 5) {
    alert("Please select up to 5 images");
    return;
  }
  setFiles(selected);

  // create previews
  const urls: string[] = [];
  Array.from(selected).forEach((file) => {
    const url = URL.createObjectURL(file);
    urls.push(url);
  });
  // revoke previous previews
  setPreviewUrls((prev) => {
    prev.forEach((u) => { try { URL.revokeObjectURL(u); } catch (e) {} });
    return urls;
  });
};
const handleSubmit = async () => {
  const formData = new FormData();
  if (files) Array.from(files).forEach((f) => formData.append("images", f));
  formData.append("title", title);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("category", category);
  formData.append("condition", condition);
  formData.append("location", location);
  // include seller info
  if (sellerName) formData.append("sellerName", sellerName);
  if (sellerContact) formData.append("sellerContact", sellerContact);
  const res = await fetch("http://localhost:5000/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  console.log("uploaded:", data);
  if (data?.success) {
    alert("Product listed successfully");
    // refresh local items cache so Browse shows it
    try {
      const raw = localStorage.getItem("items");
      const items = raw ? JSON.parse(raw) : [];
      items.unshift(data.item);
      localStorage.setItem("items", JSON.stringify(items));
    } catch (e) {}
    // navigate to browse to show the new item
    window.location.href = "/browse";
  } else {
    alert("Upload failed");
  }
};

useEffect(() => {
  return () => {
    // cleanup object URLs
    previewUrls.forEach((u) => {
      try { URL.revokeObjectURL(u); } catch (e) {}
    });
  };
}, [previewUrls]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Product Information</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="p-6 shadow-card">
                <form className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Product Name</label>
                    <Input placeholder="e.g., iPhone 12 Pro" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea 
                      placeholder="Describe your product's condition, features, and any included accessories..."
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Price (₹)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                        <Input placeholder="0.00" className="pl-8" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <Select value={category} onValueChange={(v) => setCategory(v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phones">Phones</SelectItem>
                          <SelectItem value="laptops">Laptops</SelectItem>
                          <SelectItem value="appliances">Appliances</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Condition</label>
                      <Select value={condition} onValueChange={(v) => setCondition(v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="like-new">Like New</SelectItem>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input placeholder="City, State" className="pl-10" value={location} onChange={(e) => setLocation(e.target.value)} />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Product Images</label>
                    <div className="border-2 border-dashed border-primary rounded-lg p-8 text-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
                      <Camera className="h-12 w-12 text-primary mx-auto mb-4" />
                      <p className="text-sm font-medium mb-1">Upload up to 5 photos</p>
                      <input
                       type="file"
                       multiple
                       accept="image/*"
                       onChange={handleFileChange}
                       className="hidden"
                       id="fileUpload"
                      />

                      <label
                       htmlFor="fileUpload"
                       className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-primary rounded-lg p-8"
                      >
                       <Camera className="text-primary mb-2" size={40} />
                       <p className="text-sm text-muted-foreground">Click to upload photos</p>
                      </label>
                      <p className="text-xs text-muted-foreground">JPG, PNG or WEBP (max 5MB each)</p>

                      {/* Previews */}
                      {previewUrls.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          {previewUrls.map((src, idx) => (
                            <div key={idx} className="h-24 w-full overflow-hidden rounded">
                              <img src={src} className="h-full w-full object-cover" alt={`preview-${idx}`} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button
                   variant="hero"
                   size="lg"
                   className="w-full"
                   onClick={handleSubmit}
                  >
                   List Product
                  </Button>
                </form>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6 shadow-card">
                <div className="flex items-start gap-3 mb-4">
                  <Lightbulb className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Selling Tips</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Include clear, well-lit photos</li>
                      <li>• Be honest about the condition</li>
                      <li>• Price competitively</li>
                      <li>• Respond to inquiries quickly</li>
                      <li>• Include all accessories</li>
                    </ul>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 shadow-card bg-primary/5 border-primary">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Recycler Notifications</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get notified when certified recyclers are interested in purchasing your items in bulk.
                    </p>
                    <Button variant="outline" size="sm" className="border-primary">
                      Enable Notifications
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sell;
