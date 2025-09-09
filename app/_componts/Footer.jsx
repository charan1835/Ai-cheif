"use client"
import React from "react"
import Link from "next/link"
import { Github, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10 bg-black/60 text-white/90">
      <div className="max-w-7xl mx-auto px-5 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/20 ring-1 ring-pink-400/30">🍳</span>
            <span className="text-lg font-bold">FoodRecipe</span>
          </div>
          <p className="mt-2 text-sm text-white/70">Discover, cook, and share chef-curated recipes.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="text-white font-semibold">Explore</div>
            <Link href="/" className="block hover:text-pink-300">Home</Link>
            <Link href="/upload" className="block hover:text-pink-300">Upload</Link>
            <Link href="/about" className="block hover:text-pink-300">About</Link>
          </div>
          <div className="space-y-2">
            <div className="text-white font-semibold">Account</div>
            <Link href="/sign-in" className="block hover:text-pink-300">Chef Login</Link>
            <Link href="/sign-up" className="block hover:text-pink-300">Join the Kitchen</Link>
          </div>
        </div>

        <div className="md:text-right space-y-3">
          <div className="text-white font-semibold text-sm">Follow us</div>
          <div className="flex md:justify-end gap-3">
            <Link href="#" aria-label="GitHub" className="p-2 rounded-lg bg-white/10 hover:bg-white/15 transition">
              <Github size={18} />
            </Link>
            <Link href="#" aria-label="Twitter" className="p-2 rounded-lg bg-white/10 hover:bg-white/15 transition">
              <Twitter size={18} />
            </Link>
            <Link href="#" aria-label="Instagram" className="p-2 rounded-lg bg-white/10 hover:bg-white/15 transition">
              <Instagram size={18} />
            </Link>
          </div>
          <div className="text-xs text-white/60">© {new Date().getFullYear()} FoodRecipe. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}


