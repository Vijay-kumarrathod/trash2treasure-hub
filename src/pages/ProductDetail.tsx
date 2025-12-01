import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import phoneImage from "@/assets/product-phone.jpg";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<any | null>(null);
  const [currentUser, setCurrentUser] = useState<{ name?: string; contact?: string } | null>(null);
  const [showSellerDetails, setShowSellerDetails] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [buyerContact, setBuyerContact] = useState("");
  const [buyerMessage, setBuyerMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      // try localStorage first
      let items: any[] = [];
      try {
        const raw = localStorage.getItem("items");
        if (raw) items = JSON.parse(raw);
      } catch (e) {
        items = [];
      }

      const found = items.find((it) => String(it.id) === String(id));
      if (found) {
        setItem(found);
        return;
      }

      // try fetching from server /items if available
      try {
        const res = await fetch("http://localhost:5000/items");
        if (res.ok) {
          const json = await res.json();
          const fromServer = (json.items || []).find((it: any) => String(it.id) === String(id));
          if (fromServer) {
            setItem(fromServer);
            // persist to localStorage
            localStorage.setItem("items", JSON.stringify(json.items || []));
            return;
          }
        }
      } catch (e) {
        // ignore
      }

      // fallback: no item
      setItem(null);
    };
    load();
    try {
      const rawUser = localStorage.getItem("user");
      if (rawUser) setCurrentUser(JSON.parse(rawUser));
    } catch (e) {}
  }, [id]);

  const handleContactClick = () => setShowSellerDetails((s) => !s);

  const handleBuyClick = () => setShowBuyModal(true);

  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    try {
      const raw = localStorage.getItem("inquiries");
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift({ itemId: item.id, buyerName, buyerContact, message: buyerMessage, createdAt: new Date().toISOString() });
      localStorage.setItem("inquiries", JSON.stringify(arr));
    } catch (e) {}

    const sellerContact = item.sellerContact || item.seller?.contact || item.sellerContact;
    if (sellerContact && sellerContact.includes("@")) {
      const subject = encodeURIComponent(`Interested in your item: ${item.title}`);
      const body = encodeURIComponent((buyerMessage || `Hi ${item.sellerName || ''}, I am interested in your ${item.title}.`) + `\n\nContact: ${buyerContact}\nName: ${buyerName}`);
      window.location.href = `mailto:${sellerContact}?subject=${subject}&body=${body}`;
    } else if (sellerContact) {
      alert(`Please contact seller at: ${sellerContact}`);
    } else {
      alert("Seller contact not available");
    }

    setShowBuyModal(false);
  };

  const handleDelete = async () => {
    if (!item) return;
    if (!confirm("Delete this item?")) return;

    try {
      const res = await fetch(`http://localhost:5000/items/${item.id}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sellerContact: item.sellerContact }) });
      if (res.ok) {
        // remove from localStorage
        try {
          const raw = localStorage.getItem("items");
          let items = raw ? JSON.parse(raw) : [];
          items = items.filter((it: any) => String(it.id) !== String(item.id));
          localStorage.setItem("items", JSON.stringify(items));
        } catch (e) {}
        navigate("/browse");
        return;
      }
      const text = await res.text();
      alert("Delete failed: " + text);
    } catch (e) {
      console.error(e);
      alert("Delete request failed");
    }
  };

  if (!item) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold">Item not found</h2>
            <p className="text-muted-foreground mt-2">This item could not be located.</p>
            <Button className="mt-4" onClick={() => navigate('/browse')}>Back to Browse</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card rounded shadow-card p-6">
                <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
                <div className="aspect-video bg-muted mb-4">
                  <img src={item.images?.[0] ?? phoneImage} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <p className="mb-4 whitespace-pre-line">{item.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-muted-foreground">Price</div>
                    <div className="text-2xl font-bold">₹{item.price}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Condition</div>
                    <div>{item.condition}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-card rounded shadow-card p-6">
                <h3 className="font-semibold mb-2">Details</h3>
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Location:</strong> {item.location}</p>
                {item.sellerName && (
                  <p><strong>Seller:</strong> {item.sellerName}</p>
                )}

                <div className="mt-2 flex items-center gap-2">
                  <Button onClick={handleContactClick} variant="outline">Contact</Button>
                  <Button onClick={handleBuyClick}>Buy</Button>
                </div>

                {showSellerDetails && item.sellerContact && (
                  <p className="mt-3">
                    <strong>Contact:</strong>{' '}
                    {item.sellerContact.includes('@') ? (
                      <a href={`mailto:${item.sellerContact}`} className="text-primary">{item.sellerContact}</a>
                    ) : (
                      <a href={`tel:${item.sellerContact}`} className="text-primary">{item.sellerContact}</a>
                    )}
                  </p>
                )}
                <p><strong>Posted:</strong> {new Date(item.createdAt || Date.now()).toLocaleString()}</p>
              </div>

              <div className="bg-card rounded shadow-card p-6">
                <Button variant="destructive" onClick={handleDelete}>Delete Item</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowBuyModal(false)} />
          <div className="relative bg-white rounded shadow-lg w-full max-w-md p-6 z-10">
            <h3 className="text-lg font-semibold mb-4">Contact Seller</h3>
            <form onSubmit={handleBuySubmit} className="space-y-3">
              <div>
                <label className="block text-sm">Your name</label>
                <input value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className="w-full border rounded px-2 py-1" />
              </div>
              <div>
                <label className="block text-sm">Your contact (phone or email)</label>
                <input value={buyerContact} onChange={(e) => setBuyerContact(e.target.value)} className="w-full border rounded px-2 py-1" />
              </div>
              <div>
                <label className="block text-sm">Message</label>
                <textarea value={buyerMessage} onChange={(e) => setBuyerMessage(e.target.value)} className="w-full border rounded px-2 py-1" />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setShowBuyModal(false)}>Cancel</Button>
                <Button type="submit">Send</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductDetail;
