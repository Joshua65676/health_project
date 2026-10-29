import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Service from "./Service";
import HowItWork from "./HowItWork";

const Home: React.FC = () => {
  return (
    <main className="w-full bg-white">
      <Navbar />
      <Hero />
      <Service />
      <HowItWork />
    </main>
  );
};

export default Home;
