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
            src="/food.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-black/40" />
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
