import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons for Leaflet in bundlers
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface DebrisReport {
  id: string;
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
  debris_type: string | null;
  created_at: string;
}

const Map = () => {
  const [reports, setReports] = useState<DebrisReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from("debris_reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reports:", error);
    } else {
      setReports(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-ocean mb-4">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Debris Map</h1>
          <p className="text-muted-foreground text-lg">
            View all reported debris locations
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-6 overflow-hidden">
            <CardHeader>
              <CardTitle>Interactive Map</CardTitle>
              <CardDescription>
                Explore reported debris locations around the world
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[500px] w-full">
                <MapContainer
                  center={reports.length ? [reports[0].latitude, reports[0].longitude] : [20, 0]}
                  zoom={reports.length ? 5 : 2}
                  scrollWheelZoom
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {reports.map((r) => (
                    <Marker key={r.id} position={[r.latitude, r.longitude]}>
                      <Popup>
                        <div className="space-y-1">
                          <h3 className="font-semibold">{r.title}</h3>
                          {r.description && <p className="text-sm">{r.description}</p>}
                          {r.debris_type && (
                            <p className="text-xs capitalize text-muted-foreground">
                              Type: {r.debris_type}
                            </p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Locations</CardTitle>
              <CardDescription>
                {reports.length} debris {reports.length === 1 ? "report" : "reports"} in our database
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : reports.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No reports yet. Be the first to report debris!
                </p>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-ocean flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{report.title}</h3>
                        {report.description && (
                          <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                          </span>
                          {report.debris_type && (
                            <span className="capitalize">{report.debris_type}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Map;
