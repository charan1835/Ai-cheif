"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Menu, X, Utensils, LogIn, UserPlus } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const SignInButton = dynamic(() => import("@clerk/nextjs").then(mod => mod.SignInButton), { ssr: false });
const SignUpButton = dynamic(() => import("@clerk/nextjs").then(mod => mod.SignUpButton), { ssr: false });
const UserButton = dynamic(() => import("@clerk/nextjs").then(mod => mod.UserButton), { ssr: false });

const navLinks = [
  { name: "Home", href: "/" },
  { name: "AI Chef", href: "/ai-chef" },
  { name: "Upload", href: "/upload" },
  { name: "My Bookings", href: "/mybookings" },
  { name: "About", href: "/about" },
  { name: "Connect", href: "/connect" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useUser();

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-md text-white shadow-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-5 py-3">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-pink-500/15 ring-1 ring-pink-400/30">
            <span className="text-xl drop-shadow-sm group-hover:animate-bounce" aria-hidden>
              🍳
            </span>
          </span>
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-pink-300 via-pink-200 to-white bg-clip-text text-transparent">
            FoodRecipe
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-pink-300 transition-colors"
            >
              {link.name}
            </Link>
          ))}

          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <div className="flex gap-3">
              <SignInButton mode="redirect" redirectUrl="/sign-in">
                <button className="px-4 py-2 border border-pink-500/60 text-pink-300 rounded-lg hover:bg-pink-500/10 hover:border-pink-400 transition-colors inline-flex items-center gap-2">
                  <LogIn size={18} />
                  Chef Login
                </button>
              </SignInButton>
              <SignUpButton mode="redirect" redirectUrl="/sign-up">
                <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 shadow-sm transition-colors inline-flex items-center gap-2">
                  <UserPlus size={18} />
                  Join the Kitchen
                </button>
              </SignUpButton>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded hover:bg-white/10 transition"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden px-5 py-3 bg-black/90 border-t border-white/10 space-y-2">
          {navLinks.map(link => (
            <Link
              key={link.name}
              href={link.href}
              className="block py-2 hover:text-pink-300 transition"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-2 border-t border-white/10">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <div className="flex flex-col gap-2">
                <SignInButton mode="redirect" redirectUrl="/sign-in">
                  <button className="w-full px-4 py-2 border border-pink-500/60 text-pink-300 rounded-lg hover:bg-pink-500/10 hover:border-pink-400 transition-colors inline-flex items-center justify-center gap-2">
                    <LogIn size={18} />
                    Chef Login
                  </button>
                </SignInButton>
                <SignUpButton mode="redirect" redirectUrl="/sign-up">
                  <button className="w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 shadow-sm transition-colors inline-flex items-center justify-center gap-2">
                    <UserPlus size={18} />
                    Join the Kitchen
                  </button>
                </SignUpButton>
              </div>
            )}  
          </div>
        </div>
      )}
    </nav>
  );
}
