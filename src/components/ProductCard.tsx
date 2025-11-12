import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  image: string;
  title: string;
  price: number;
  condition: string;
  category: string;
}

const ProductCard = ({ image, title, price, condition, category }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-glow transition-all duration-300 group">
      <div className="aspect-square overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs">{category}</Badge>
          <Badge variant="outline" className="text-xs border-primary text-primary">{condition}</Badge>
        </div>
        <h3 className="font-semibold line-clamp-2">{title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">${price}</span>
          <Button variant="default" size="sm">View Details</Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
