import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TeamCardProps {
  name: string;
  role: string;
  description: string;
  image: string;
  technologies: string[];
}

const TeamCard = ({ name, role, description, image, technologies }: TeamCardProps) => {
  return (
    <Card className="bg-dark-card border-gray-800 overflow-hidden hover:border-primary transition-all duration-300">
      <div className="p-6 space-y-4">
        <Badge className="bg-primary/20 text-primary border-primary">{role}</Badge>
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs border-gray-700 text-gray-400">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TeamCard;
