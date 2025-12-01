// src/pages/Team.tsx
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamCard from "@/components/TeamCard";

/**
 * Safe Team page:
 * - No local missing image imports
 * - Uses placeholder images (online) so Vite won't complain
 * - You can later replace placeholder URLs with real local assets in src/assets
 */

const team = [
  {
    id: 1,
    name: "Vijaykumar",
    role: "Frontend Developer",
    description: "Specializes in creating beautiful and responsive UI.",
    image: "https://via.placeholder.com/300x300?text=Vijay",
    technologies: ["React", "TypeScript", "Tailwind CSS"]
  },
  {
    id: 2,
    name: "Chandan B",
    role: "Backend Developer",
    description: "Expert in building scalable server-side applications.",
    image: "https://via.placeholder.com/300x300?text=Chandan",
    technologies: ["Node.js", "Express", "Postgres"]
  },
  {
    id: 3,
    name: "Lekhana",
    role: "Database & API Specialist",
    description: "Designs efficient database schemas and implements robust APIs.",
    image: "https://via.placeholder.com/300x300?text=Lekhana",
    technologies: ["SQL", "REST API"]
  },
  {
    id: 4,
    name: "Veenashee",
    role: "UI/UX Support",
    description: "Creates intuitive user experiences and visuals.",
    image: "https://via.placeholder.com/300x300?text=Veenashee",
    technologies: ["Figma", "UI Design"]
  }
];

const Team = () => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-semibold mb-6 text-center">Meet the Team</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <TeamCard
              key={member.id}
              name={member.name}
              role={member.role}
              description={member.description}
              image={member.image}
              technologies={member.technologies}
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Team;