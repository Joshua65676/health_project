import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Service from "./Service";
import HowItWork from "./HowItWork";
import Review from "./Review";
import Footer from "./Footer";

const Home: React.FC = () => {
  return (
    <main className="w-full bg-white">
      <Navbar />
      <Hero />
      <Service />
      <HowItWork />
      <Review />
      <Footer />
    </main>
  );
};

export default Home;
