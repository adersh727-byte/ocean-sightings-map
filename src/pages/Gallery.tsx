import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Image as ImageIcon, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

interface DebrisReport {
  id: string;
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
  photo_url: string | null;
  debris_type: string | null;
  created_at: string;
}

const Gallery = () => {
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

  const getDebrisTypeColor = (type: string | null) => {
    switch (type) {
      case "plastic":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300";
      case "metal":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-300";
      case "glass":
        return "bg-green-500/10 text-green-700 dark:text-green-300";
      case "fishing-gear":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-300";
      default:
        return "bg-purple-500/10 text-purple-700 dark:text-purple-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-ocean mb-4">
            <ImageIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Debris Gallery</h1>
          <p className="text-muted-foreground text-lg">
            Browse reports from our community of ocean advocates
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No reports yet. Be the first to report debris!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card key={report.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {report.photo_url && (
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <img
                      src={report.photo_url}
                      alt={report.title}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl">{report.title}</CardTitle>
                    {report.debris_type && (
                      <Badge className={getDebrisTypeColor(report.debris_type)}>
                        {report.debris_type}
                      </Badge>
                    )}
                  </div>
                  {report.description && (
                    <CardDescription className="line-clamp-2">
                      {report.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(report.created_at), "MMM d, yyyy")}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
