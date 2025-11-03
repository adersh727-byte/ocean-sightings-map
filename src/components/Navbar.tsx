import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Waves, MapPin, Image, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Waves className="h-6 w-6 text-primary animate-wave" />
            <span className="text-xl font-bold bg-gradient-ocean bg-clip-text text-transparent">
              OceanWatch
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/map">
              <Button
                variant={location.pathname === "/map" ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <MapPin className="h-4 w-4" />
                Map
              </Button>
            </Link>
            <Link to="/gallery">
              <Button
                variant={location.pathname === "/gallery" ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Image className="h-4 w-4" />
                Gallery
              </Button>
            </Link>

            {user ? (
              <>
                <Link to="/report">
                  <Button size="sm" variant="secondary" className="gap-2">
                    <MapPin className="h-4 w-4" />
                    Report Debris
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button size="sm" variant="secondary" className="gap-2">
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
