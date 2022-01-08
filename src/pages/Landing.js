import React from "react";

import Hero from "../components/sections/Hero";
import LandingLayout from "../components/layouts/LandingLayout";

export default function Landing() {
  return (
    <LandingLayout>
      <Hero
        title="Resume management simplified."
        subtitle="Powerful version control and sharing features at your fingertips."
        image="https://source.unsplash.com/collection/404339/800x600"
        ctaText="Get started now!"
        ctaLink="/signup"
      />
    </LandingLayout>
  );
}