import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Image, Waves, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import heroImage from "@/assets/hero-ocean.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-primary/20">
            <Waves className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Community-Powered Ocean Conservation</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Track & Report<br />
            <span className="bg-gradient-ocean bg-clip-text text-transparent">
              Marine Debris
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join our community in protecting our oceans. Report debris locations, upload photos, and help make a difference.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/report">
              <Button size="lg" variant="secondary" className="gap-2 shadow-lg">
                <MapPin className="h-5 w-5" />
                Report Debris
              </Button>
            </Link>
            <Link to="/map">
              <Button size="lg" variant="outline" className="gap-2 shadow-lg bg-background/80 backdrop-blur-sm">
                <MapPin className="h-5 w-5" />
                View Map
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-gradient-ocean flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-card-foreground">Easy Reporting</h3>
            <p className="text-muted-foreground">
              Report debris locations with just a few taps. Add photos and descriptions to help track pollution.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-gradient-ocean flex items-center justify-center mb-4">
              <Image className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-card-foreground">Photo Documentation</h3>
            <p className="text-muted-foreground">
              Visual evidence helps raise awareness. Browse our gallery of reported debris from around the world.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-gradient-ocean flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-card-foreground">Community Driven</h3>
            <p className="text-muted-foreground">
              Join thousands of ocean advocates working together to monitor and protect our marine environments.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-ocean">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Every report helps us understand and combat marine pollution. Your contribution matters.
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="shadow-xl">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
