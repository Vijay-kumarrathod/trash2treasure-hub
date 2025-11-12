import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamCard from "@/components/TeamCard";
import vijayImage from "@/assets/team-vijay.jpg";
import chandanImage from "@/assets/team-chandan.jpg";
import lekhanImage from "@/assets/team-lekhan.jpg";
import veenashreeImage from "@/assets/team-veenashree.jpg";

const Team = () => {
  const team = [
    {
      name: "Vijaykumar",
      role: "Frontend Developer",
      description: "Specializes in creating beautiful and responsive user interfaces with modern web technologies.",
      image: vijayImage,
      technologies: ["React", "TypeScript", "Tailwind CSS", "Next.js"]
    },
    {
      name: "Chandan B",
      role: "Backend Developer",
      description: "Expert in building scalable server-side applications and RESTful APIs.",
      image: chandanImage,
      technologies: ["Node.js", "Express", "PostgreSQL", "MongoDB"]
    },
    {
      name: "Lekhan",
      role: "Database & API Specialist",
      description: "Designs efficient database schemas and implements robust API architectures.",
      image: lekhanImage,
      technologies: ["SQL", "REST API", "GraphQL", "Redis"]
    },
    {
      name: "Veenashree",
      role: "UI/UX Design Supporter",
      description: "Creates intuitive user experiences and stunning visual designs that delight users.",
      image: veenashreeImage,
      technologies: ["Figma", "Adobe XD", "Sketch", "Prototyping"]
    }
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Meet Our <span className="text-primary">Team</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Talented individuals working together to revolutionize e-waste recycling and make technology more accessible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {team.map((member) => (
              <TeamCard key={member.name} {...member} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Team;
