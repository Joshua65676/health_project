import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";

const Home: React.FC = () => {
  return (
    <main className="w-full bg-white">
      <Navbar />
      <Hero />
    </main>
  );
};

export default Home;
