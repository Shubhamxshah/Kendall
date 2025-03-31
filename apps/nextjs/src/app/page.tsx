import { Button } from '@repo/ui/components/base/button';
import { HeroSection } from '@/components/HeroSection';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <HeroSection />
    </div>
  );
}
