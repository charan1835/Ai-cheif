"use client";
import { useState } from "react";
import Link from "next/link";
import { ChefHat, Sparkles, Users, TrendingUp } from "lucide-react";
import Fooditems from "./_componts/Fooditems";
import Items from "./_componts/items";
import globals from "./globals.css";

export default function Home() {
  const [selectedSlug, setSelectedSlug] = useState("");

  return (
    <>
      {/* Hero Section */}
      <section className="relative px-5 py-20 md:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-orange-400/20 border border-pink-400/30 mb-6">
              <Sparkles className="w-4 h-4 text-pink-300" />
              <span className="text-sm font-medium text-pink-200">AI-Powered Recipe Discovery</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-pink-300 via-rose-200 to-orange-200 bg-clip-text text-transparent">
                Discover Amazing
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-300 via-pink-200 to-rose-300 bg-clip-text text-transparent">
                Food Recipes
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8 leading-relaxed">
              From traditional Indian cuisine to modern fusion dishes, explore thousands of chef-curated recipes 
              powered by AI. Cook with confidence and discover your next favorite meal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              href="/ai-chef"
              className="group px-8 py-4 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
            >
              <ChefHat className="w-5 h-5" />
              Chat with AI Chef
            </Link>
            
            <button 
              onClick={() => document.getElementById('food-items').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 hover:border-white/50 transition-all duration-300"
            >
              Explore Recipes
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-pink-500/20 to-orange-400/20 border border-pink-400/30 mb-3">
                <Users className="w-6 h-6 text-pink-300" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">10K+</div>
              <div className="text-sm text-white/70">Happy Cooks</div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-pink-500/20 to-orange-400/20 border border-pink-400/30 mb-3">
                <ChefHat className="w-6 h-6 text-pink-300" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">5K+</div>
              <div className="text-sm text-white/70">Recipes</div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-pink-500/20 to-orange-400/20 border border-pink-400/30 mb-3">
                <TrendingUp className="w-6 h-6 text-pink-300" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">50+</div>
              <div className="text-sm text-white/70">Cuisines</div>
            </div>
          </div>
        </div>
      </section>

      {/* Food Items Section */}
      <div id="food-items">
        <Fooditems onSelectItem={setSelectedSlug} />
      </div>

      {/* Filter Section */}
      <div className="px-5 mt-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recipe Collection</h2>
          <div className="flex items-center gap-3">
            <button
              className={`px-4 py-2 text-sm rounded-full border transition-all duration-300 ${
                selectedSlug 
                  ? 'border-white/40 bg-white/10 text-white hover:bg-white/20' 
                  : 'border-pink-400 bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-lg'
              }`}
              onClick={() => setSelectedSlug("")}
            >
              All Items
            </button>
            {selectedSlug && (
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">Filter:</span>
                <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full">
                  {selectedSlug}
                </span>
                <button
                  onClick={() => setSelectedSlug("")}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Items itemSlug={selectedSlug} />
    </>
  );
}


