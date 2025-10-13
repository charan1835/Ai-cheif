"use client";

import { useState, useEffect } from "react";
import { getRecipes } from "../_utils/hygraph-service";
import { BookOpenText } from "lucide-react";

export default function UploadPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRecipes();
      setRecipes(data.recipies || []);
    } catch (err) {
      setError("Failed to load recipes.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="pt-20 px-5 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
          <BookOpenText className="text-pink-400" />
          Community Recipes
        </h1>
        <p className="mt-2 text-lg text-white/80">
          Browse delicious recipes shared by our community.
        </p>
      </div>

      {loading && <p className="text-center text-white/80">Loading recipes...</p>}
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe, index) => (
            <div key={index} className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:-translate-y-2 transition-transform duration-300">
              <img src={recipe.image.url} alt={recipe.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{recipe.name}</h3>
                <p className="text-white/70 text-sm line-clamp-2">{recipe.fulldetails}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}