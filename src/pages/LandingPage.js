import React from "react";

import Hero from "../components/sections/Hero";
import LandingLayout from "../components/layouts/LandingLayout";
import leaves from "../assets/leaves.jpg"

export default function LandingPage() {
  return (
    <LandingLayout>
      <Hero
        title="Resume management simplified."
        subtitle="Powerful version control and sharing features at your fingertips."
        image={leaves}
        ctaText="Get started for free now!"
        ctaLink="/dashboard"
      />
    </LandingLayout>
  );
}
