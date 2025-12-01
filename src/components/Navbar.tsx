import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { Recycle } from "lucide-react";
import { useEffect, useState } from "react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <Recycle className="h-8 w-8 text-primary group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-xl font-bold">
              <span className="text-primary">Trash2</span>
              <span className="text-foreground">Treasure</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <NavLink 
              to="/" 
              className="text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary font-semibold"
            >
              Home
            </NavLink>
            <NavLink 
              to="/browse" 
              className="text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary font-semibold"
            >
              Browse
            </NavLink>
            <NavLink 
              to="/sell" 
              className="text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary font-semibold"
            >
              Sell
            </NavLink>
            <NavLink 
              to="/help" 
              className="text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary font-semibold"
            >
              Help
            </NavLink>
            <NavLink 
              to="/team" 
              className="text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary font-semibold"
            >
              Team
            </NavLink>
            <NavLink 
              to="/contact" 
              className="text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary font-semibold"
            >
              Contact
            </NavLink>
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

const AuthButton = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name?: string; contact?: string } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
      else setUser(null);
    } catch (e) {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    try { localStorage.removeItem("user"); } catch (e) {}
    setUser(null);
    navigate("/");
  };

  if (user) {
    return (
      <button className="text-sm text-foreground hover:text-primary" onClick={handleLogout} title="Logout">
        Logout ({user.name || "Seller"})
      </button>
    );
  }

  return (
    <Link to="/login" className="text-sm text-foreground hover:text-primary">Login</Link>
  );
};

export default Navbar;
