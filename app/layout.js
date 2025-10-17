import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import globals from "./globals.css";
import Header from "./_componts/Header";
import Footer from "./_componts/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FoodRecipe",
  description: "Food Recipe App",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className + " " + globals}>
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <video
            className="min-w-full min-h-full object-cover"
            poster="/food-poster.jpg"
            src="/food.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        </div>
        <Header />
        <main className="pt-16 md:pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
    </ClerkProvider>
  );
}
