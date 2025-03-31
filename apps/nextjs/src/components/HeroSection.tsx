import { Button } from '@repo/ui/components/base/button';
import { Users, Video, Share2, MessageCircle } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* background gradient */}
      <div className="absolute h-[60vh] bg-gradient-to-b from-primary/20 via-accent/10 to-transparent -z-10" />
      {/* floating icons */}
      <div className="top-40 left-1/4 animate-float transform -translate-x-1/2">
        <Users size={30} className="text-primary/60" />
      </div>
      <div className="absolute top-60 right-1/4 animate-float animation-delay-200">
        <Video size={30} className="text-secondary/30" />
      </div>
      <div className="absolute bottom-40 left-1/3 animate-float animation-delay-300">
        <Share2 size={30} className="text-accent/60" />
      </div>
      <div className="absolute bottom-60 right-1/3 animate-float animation-delay-400">
        <MessageCircle size={30} className="text-primary-60" />
      </div>

      <div className="container mx-auto max-w-6xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Connect, Watch, Share in <br />
          <span className="gradient-text">Real-time communities</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          Join rooms, host watch parties, share your screen, and build communities. Experience
          content together like never before with kendall.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" variant="default" className="px-8 py-6 text-lg">
            {' '}

            
            Get Started{' '}
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6">
            {' '}
            Watch Demo{' '}
          </Button>
        </div>
      </div>

      {/* App preview */}
      <div className="relative w-full max-w-5xl mx-auto glass p-3 rounded-xl shadow-xl">
        <div className="relative aspect-video w-full bg-card rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Mock UI */}
            <div className="w-full h-full grid grid-cols-4 gap-1 p-2">
              <div className="col-span-3 bg-background rounded-lg border border-border">
                <div className="h-8 border-b border-border flex items-center px-3">
                  <div className="h-3 w-3 bg-destructive rounded-full mr-2" />
                  <div className="h-3 w-3 bg-accent rounded-full mr-2" />
                  <div className="h-3 w-3 bg-secondary rounded-full" />
                </div>
                <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)]">
                  <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center animate-pulse-light">
                    <Video size={30} className="text-primary" />
                  </div>
                  <p className="text-sm mt-4 text-muted-foreground">
                    Shared video content appears here
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex-1 bg-card rounded-lg border border-border p-2">
                  <div className="h-5 w-20 bg-muted rounded mb-2" />
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20" />
                      <div className="h-4 w-12 bg-muted rounded" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary/20" />
                      <div className="h-4 w-16 bg-muted rounded" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-accent/20" />
                      <div className="h-4 w-10 bg-muted rounded" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-card rounded-lg border border-border p-2">
                  <div className="h-5 w-16 bg-muted rounded mb-2" />
                  <div className="flex flex-col gap-2 mt-auto">
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-3/4 bg-muted rounded" />
                    <div className="h-4 w-5/6 bg-muted rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
