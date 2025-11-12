import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
}

const CategoryCard = ({ icon: Icon, title, description, link }: CategoryCardProps) => {
  return (
    <Card className="p-6 hover:shadow-glow transition-all duration-300 border-2 hover:border-primary group">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
        <Button variant="outline" className="w-full">
          Browse {title}
        </Button>
      </div>
    </Card>
  );
};

export default CategoryCard;
