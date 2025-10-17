import { Construction } from 'lucide-react';

export default function ComingSoonPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-white text-center px-4">
      <Construction className="w-24 h-24 mb-6 text-pink-400 animate-pulse" />
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-300 via-pink-200 to-white bg-clip-text text-transparent mb-4">
        Feature Coming Soon!
      </h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
        Our team is busy in the kitchen preparing this feature. Please check back later to explore what we're cooking up!
      </p>
    </div>
  );
}