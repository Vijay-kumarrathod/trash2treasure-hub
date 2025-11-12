import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageCircle, Phone, Mail, FileQuestion, Send } from "lucide-react";

const Help = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "support" }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { 
        id: messages.length + 1, 
        text: inputMessage, 
        sender: "user" 
      }]);
      setInputMessage("");
      
      // Simulate response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: prev.length + 1, 
          text: "Thank you for your message. Our support team will assist you shortly.", 
          sender: "support" 
        }]);
      }, 1000);
    }
  };

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
                </div>
                
                <div className="p-4 border-t flex gap-2">
                  <Input 
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
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
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Us: 1-800-RECYCLE
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                  </Button>
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
