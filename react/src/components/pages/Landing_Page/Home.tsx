import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Service from "./Service";

const Home: React.FC = () => {
  return (
    <main className="w-full bg-white">
      <Navbar />
      <Hero />
      <Service />
    </main>
  );
};

export default Home;
