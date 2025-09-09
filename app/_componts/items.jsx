"use client"
import React, { useEffect, useState } from "react"
import { getAllTypes, getTypesByItemSlug } from "../_utils/GlobalApi"

export default function Items({ itemSlug }) {
  const [types, setTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = itemSlug ? await getTypesByItemSlug(itemSlug) : await getAllTypes()
        if (!mounted) return
        setTypes(data?.typoffoods || [])
      } catch (e) {
        if (!mounted) return
        setError("Failed to load types")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [itemSlug])

  if (loading) return <div className="px-5 py-6 text-white/80">Loading items...</div>
  if (error) return <div className="px-5 py-6 text-red-500">{error}</div>

  return (
    <div className="px-5 py-12">
      <div className="max-w-7xl mx-auto">
        {types.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Recipe Collection</h3>
            <p className="text-white/70">Discover delicious recipes in this category</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {types.map((t, idx) => (
            <div 
              key={t.slug || idx} 
              className="group rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm ring-1 ring-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 card-hover animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={t?.foodimg?.url || "https://via.placeholder.com/400x300"} 
                  alt={t?.names || "Type"} 
                  className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm">→</span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-semibold text-gray-800 group-hover:text-pink-600 transition-colors text-center">
                  {t?.names || "Type"}
                </h4>
              </div>
            </div>
          ))}
        </div>
        
        {types.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500/20 to-orange-400/20 border border-pink-400/30 mb-4">
              <span className="text-2xl">🍽️</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No recipes found</h3>
            <p className="text-white/70">Try selecting a different category or explore our AI Chef for personalized recommendations.</p>
          </div>
        )}
      </div>
    </div>
  )
}

