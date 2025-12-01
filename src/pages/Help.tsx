import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageCircle, Phone, Mail, FileQuestion, Send } from "lucide-react";

const Help = () => {
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem("help.chat.history");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [{ id: 1, text: "Hello! How can I help you today?", sender: "support" }];
  });
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [sessionId, setSessionId] = useState(() => {
    try {
      const stored = localStorage.getItem('help.sessionId');
      if (stored) return stored;
      const gen = `s-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
      localStorage.setItem('help.sessionId', gen);
      return gen;
    } catch (e) {
      return `s-${Date.now()}`;
    }
  });

  const presets = [
    { id: 'phonepe', label: 'PhonePe / UPI payment failed', text: 'My PhonePe payment failed but money was debited. How do I get refund or retry the payment?' },
    { id: 'refund', label: 'Order refund status', text: 'I requested a refund. How long will it take and what are the next steps?' },
    { id: 'sell', label: 'How to sell an item', text: 'How do I list an item for sale and what are the tips to get it sold faster?' },
    { id: 'contact', label: 'Contact owner', text: 'I want to contact the owner about a listing. Provide the best way to contact them.' },
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;
    const userMsg = { id: messages.length + 1, text: inputMessage, sender: "user" };
    const next = [...messages, userMsg];
    setMessages(next);
    setInputMessage("");
    setIsTyping(true);
    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, userId: sessionId }),
      });
      if (res.ok) {
        const json = await res.json();
        const bot = { id: next.length + 1, text: json.reply || "", sender: "support" };
        const updated = [...next, bot];
        setMessages(updated);
        try { localStorage.setItem("help.chat.history", JSON.stringify(updated)); } catch (e) {}
        return;
      }
    } catch (e) {
      console.error("Chat fetch failed", e);
    } finally {
      // if fetch failed or succeeded, ensure typing state cleared later
      setIsTyping(false);
    }

    // Fallback canned response
    const fallback = { id: next.length + 1, text: `Thank you for your message. Our support team will assist you shortly. If you need immediate help, you can call +91 6363325638 or email Vijaykumarrathod741@gmail.com`, sender: "support" };
    const final = [...next, fallback];
    setMessages(final);
    try { localStorage.setItem("help.chat.history", JSON.stringify(final)); } catch (e) {}
    setIsTyping(false);
  };

  // Load session from server on first render
  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/chat/session/${sessionId}`);
        if (res.ok) {
          const json = await res.json();
          const srv = json.messages || [];
          if (Array.isArray(srv) && srv.length) {
            const mapped = srv.map((m: any, i: number) => ({ id: i + 1, sender: m.role === 'assistant' ? 'support' : 'user', text: m.content }));
            setMessages(mapped);
            try { localStorage.setItem('help.chat.history', JSON.stringify(mapped)); } catch (e) {}
          }
        }
      } catch (e) {
        // ignore
      }
    };
    loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Send a preset prompt as a user message (builds OpenAI-format message list)
  const sendPreset = async (presetText: string) => {
    if (isTyping) return;
    const userMsg = { id: messages.length + 1, text: presetText, sender: 'user' };
    const next = [...messages, userMsg];
    setMessages(next);
    setIsTyping(true);

    // build OpenAI messages from conversation (map sender -> role)
    const apiMessages = next.map((m: any) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, userId: sessionId }),
      });
      if (res.ok) {
        const json = await res.json();
        const bot = { id: next.length + 1, text: json.reply || '', sender: 'support' };
        const updated = [...next, bot];
        setMessages(updated);
        try { localStorage.setItem('help.chat.history', JSON.stringify(updated)); } catch (e) {}
        return;
      }
    } catch (e) {
      console.error('Preset chat fetch failed', e);
    } finally {
      setIsTyping(false);
    }

    // fallback
    const fallback = { id: next.length + 1, text: `Thank you. For immediate help call +91 6363325638 or email Vijaykumarrathod741@gmail.com`, sender: 'support' };
    const final = [...next, fallback];
    setMessages(final);
    try { localStorage.setItem('help.chat.history', JSON.stringify(final)); } catch (e) {}
    setIsTyping(false);
  };

  // Persist messages whenever they change
  useEffect(() => {
    try { localStorage.setItem("help.chat.history", JSON.stringify(messages)); } catch (e) {}
  }, [messages]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-muted-foreground mb-8">Get instant support and find answers to your questions</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chat Panel */}
            <div className="lg:col-span-2">
              <Card className="shadow-card overflow-hidden">
                <div className="bg-primary text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5" />
                    <div>
                      <h3 className="font-semibold">Live Chat</h3>
                      <p className="text-xs text-primary-foreground/80">Online - Usually responds in minutes</p>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                
                <div className="h-96 p-4 overflow-y-auto bg-muted/20">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div 
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.sender === "user" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-card border"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="mb-4 flex justify-start">
                      <div className="max-w-xs px-4 py-2 rounded-lg bg-card border text-muted-foreground">Typing...</div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t flex gap-2">
                  <Input 
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} disabled={isTyping || !inputMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* FAQ */}
              <Card className="p-6 shadow-card">
                <div className="flex items-center gap-2 mb-4">
                  <FileQuestion className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Frequently Asked</h3>
                </div>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-sm">How do refunds work?</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      Refunds are processed within 5-7 business days after we receive the returned item.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-sm">What's your warranty policy?</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      All refurbished items come with a 90-day warranty covering defects and malfunctions.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-sm">How long is shipping?</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      Standard shipping takes 3-5 business days. Express shipping is available for an additional fee.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
              
              {/* Quick Support */}
              <Card className="p-6 shadow-card">
                <h3 className="font-semibold mb-4">Quick Support</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    <a href="tel:+916363325638" className="block">
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Vijaykumar: +91 6363325638
                      </Button>
                    </a>
                    <a href="tel:+919686133711" className="block">
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Chandan: +91 9686133711
                      </Button>
                    </a>
                    <a href="tel:+917019732659" className="block">
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Lekhana: +91 7019732659
                      </Button>
                    </a>
                    <a href="tel:+918217702676" className="block">
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Veenashree: +91 8217702676
                      </Button>
                    </a>
                    <a href={`mailto:Vijaykumarrathod741@gmail.com?subject=${encodeURIComponent("Support request from Trash2Treasure")}`} className="block">
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Email: Vijaykumarrathod741@gmail.com
                      </Button>
                    </a>
                  </div>
                  <div className="pt-2">
                    <div className="text-xs text-muted-foreground mb-2">Try a quick example:</div>
                    <div className="flex flex-col gap-2">
                      {presets.map(p => (
                        <Button key={p.id} variant="ghost" className="justify-start" onClick={() => sendPreset(p.text)}>{p.label}</Button>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Community Forum
                  </Button>
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

export default Help;
