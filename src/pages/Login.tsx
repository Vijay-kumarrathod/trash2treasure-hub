import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = { name: name || "Seller", contact: contact || "" };
    try {
      localStorage.setItem("user", JSON.stringify(user));
      // associate existing anonymous chat session with this userId (contact)
      try {
        const anon = localStorage.getItem('help.sessionId');
        if (anon && user.contact) {
          fetch('http://localhost:5000/api/chat/session-associate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: anon, userId: user.contact }),
          }).catch(() => {});
          // store the authoritative session id as the user id so Help uses it
          localStorage.setItem('help.sessionId', user.contact);
        }
      } catch (e) {}
    } catch (e) {}
    navigate("/sell");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow-card">
            <h1 className="text-2xl font-semibold mb-4">Login / Seller Details</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Your Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Contact (phone or email)</label>
                <Input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Phone or email" />
              </div>
              <Button type="submit" className="w-full">Continue to Sell</Button>
            </form>
            <p className="text-sm text-muted-foreground mt-4">Your contact will be attached to any listing so buyers can contact you directly.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
