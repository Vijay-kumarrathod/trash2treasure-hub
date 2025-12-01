import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, ExternalLink } from "lucide-react";

const Contact = () => {
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in name, email and message");
      return;
    }

    try {
      console.log('Contact submit to', `${API_BASE}/contact`);
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, category, message }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        // If the server returned HTML with 'Cannot POST /contact', offer guidance
        if (/Cannot POST \/contact/.test(txt)) {
          toast.error('Failed to send message: server did not accept POST on /contact. Did you start the backend on port 5000?');
        } else {
          toast.error('Failed to send message: ' + (txt || res.status));
        }
        return;
      }
      const json = await res.json().catch(() => null);
      if (json && json.success) {
        toast.success('Message sent - we will contact you soon');
        setName(''); setEmail(''); setSubject(''); setCategory(''); setMessage('');
        try { window.dispatchEvent(new Event('items-updated')); } catch(e){}
        // Check server health / SMTP state and advise if email was sent
        try {
          const h = await fetch(`${API_BASE}/health`).then((r) => r.json());
          if (!h.smtpConfigured) {
            toast('Note: Email notifications are not configured on the server (messages are stored, but not emailed).');
          }
        } catch (e) {}
      } else {
        toast.error('Message send failed');
      }
    } catch (e) {
      toast.error('Failed to send message: ' + String(e));
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-6 shadow-card">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Full Name</label>
                      <Input placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Subject</label>
                      <Input placeholder="How can we help?" value={subject} onChange={(e) => setSubject(e.target.value)} />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <Select value={category} onValueChange={(v) => setCategory(v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <Textarea 
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  
                  <Button variant="hero" size="lg" className="w-full" type="submit">
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="p-6 shadow-card">
                <h3 className="font-semibold mb-4">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">Vijaykumar: +91 6363325638</p>
                      <p className="text-sm text-muted-foreground">Chandan: +91 9686133711</p>
                      <p className="text-sm text-muted-foreground">Lekhana: +91 7019732659</p>
                      <p className="text-sm text-muted-foreground">Veenashree: +91 8217702676</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">Vijaykumarrathod741@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">GSKSJTI College</p>
                      <p className="text-sm text-muted-foreground">KR Circle, Bengaluru - 560001</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 shadow-card">
                <div className="flex items-start gap-3 mb-4">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Business Hours</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 4:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 shadow-card bg-muted/50">
                <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-muted-foreground">
                  <MapPin className="h-12 w-12" />
                </div>
                <Button variant="outline" className="w-full" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Google Maps
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
