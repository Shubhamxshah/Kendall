import { Button } from '@repo/ui/components/base/button';
import { HeroSection } from '@/components/HeroSection';
import Navbar from '@/components/Navbar';
import { Clock, Globe, MessageCircle, Share2, Users, Video } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <HeroSection />

      <section className="py-20 px-4" id="features">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to connect</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kendall brings together the best features for sharing experiences in real time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Video}
              title="Watch Parties"
              description="watch videos together with synchronized playbacks and anyone coud control timestamps"
            />

            <FeatureCard
              icon={Users}
              title="Screen Sharing"
              description="Share your screen with others for tutorials, presentations or gaming"
              variant="secondary"
            />

            <FeatureCard
              icon={Share2}
              title="Community rooms"
              description="Create or join communites to connect with like minded people"
              variant="accent"
            />

            <FeatureCard
              icon={MessageCircle}
              title="Audio Chat"
              description="Talk with others via high-quality, low-latency voice-chat"
              variant="primary"
            />

            <FeatureCard
              icon={Clock}
              title="Schedule events"
              description="Plan and schedule events for your community with automatic notifications"
              variant="secondary"
            />

            <FeatureCard
              icon={Globe}
              title="Cross-platform"
              description="Access kendall from anywhere - web, desktop or mobile devices"
              variant="accent"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
