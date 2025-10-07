"use client";

import { Hero } from "./components/Hero";

export default function Home() {
  const charcoal = '#08080A';    // Near-black base

  return (
    <div className="font-sans relative min-h-screen flex flex-col items-center text-white overflow-hidden" 
        >
      <main className="w-full max-w-4xl px-8 sm:px-16 text-center flex flex-col items-center justify-center gap-16 py-24 z-10 
                       backdrop-blur-lg 
                       rounded-2"
              
      >
        <Hero />
      </main>
      
    </div>
  );
}