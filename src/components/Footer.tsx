import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Recycle, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-dark-bg text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Recycle className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Trash2Treasure</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Transforming e-waste into treasure. Buy and sell refurbished electronics with confidence.
            </p>
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white">
              Download App
            </Button>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/browse" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Browse
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Sell
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Help
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Customer Service
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h3 className="font-semibold mb-4">Subscribe</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get updates on new products and deals
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-dark-card border-gray-700 text-white placeholder:text-gray-500"
              />
              <Button variant="default" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
          © 2025 Trash2Treasure. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
