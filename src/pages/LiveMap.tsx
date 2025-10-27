import { useState, useEffect } from "react";
import { MapPin, Phone, Navigation, Share2, AlertTriangle, Filter, Search, Bookmark, Edit, Clock, Globe, Star, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import EnhancedMapComponent from "@/components/EnhancedMapComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const LiveMap = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sharing, setSharing] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [searchedLocation, setSearchedLocation] = useState<any>(null);
  const [showDirections, setShowDirections] = useState(false);

  // Mock location data for searched place
  const mockLocationDetails = {
    name: "Delhi Animal Welfare Society",
    address: "Connaught Place, New Delhi, Delhi 110001",
    phone: "+91-11-2334-5678",
    website: "www.daws.org.in",
    rating: 4.5,
    totalReviews: 250,
    hours: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 6:00 PM",
      saturday: "9:00 AM - 4:00 PM",
      sunday: "Closed"
    },
    status: "Open now",
    description: "Leading animal welfare organization providing rescue services, medical care, and adoption facilities for animals in need across Delhi NCR.",
    services: ["Emergency Rescue", "Veterinary Care", "Adoption Services", "Animal Rehabilitation"],
    recentUpdates: [
      { date: "2 days ago", text: "New adoption drive this weekend! 20+ animals ready for loving homes." },
      { date: "1 week ago", text: "Successfully rescued and treated 15 street animals this month." }
    ],
    images: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400",
      "https://images.unsplash.com/photo-1581888227599-779811939961?w=400"
    ]
  };

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast({ description: "Location obtained successfully! 📍" });
        },
        (error) => {
          toast({ description: "Unable to get location. Please enable location services.", variant: "destructive" });
        }
      );
    } else {
      toast({ description: "Geolocation is not supported by this browser.", variant: "destructive" });
    }
  };

  const handleShareLocation = () => {
    if (!userLocation) {
      toast({ description: "Please get your location first.", variant: "destructive" });
      return;
    }
    
    setSharing(true);
    setTimeout(() => {
      setSharing(false);
      toast({ description: "Location shared with nearby rescuers! 🚨" });
    }, 2000);
  };

  const handleEmergencyAlert = () => {
    setEmergencyMode(true);
    handleGetLocation();
    toast({ 
      description: "🚨 Emergency alert activated! Notifying nearby rescuers and authorities.", 
      variant: "destructive" 
    });
  };

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
    setSearchedLocation(null);
    toast({ 
      description: `Selected: ${location.name}. Click for directions and contact info.` 
    });
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Simulate geocoding
      setSearchedLocation({
        lat: 28.6139,
        lng: 77.2090,
        name: searchTerm,
        ...mockLocationDetails
      });
      setSelectedLocation(null);
      toast({ description: `Found: ${searchTerm}` });
    }
  };

  const handleGetDirections = () => {
    const target = searchedLocation || selectedLocation;
    if (!target) {
      toast({ description: "Please select a location first" });
      return;
    }
    setShowDirections(true);
    toast({ description: "Calculating best route..." });
  };

  const handleCall = () => {
    const target = searchedLocation || selectedLocation;
    if (!target) return;
    const phone = target.phone || target.contact?.phone || target.contactNumber;
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleSave = () => {
    const target = searchedLocation || selectedLocation;
    if (!target) return;
    toast({ description: `${target.name} saved to your favorites!`, duration: 2000 });
  };

  const handleShare = () => {
    const target = searchedLocation || selectedLocation;
    if (!target) return;
    if (navigator.share) {
      navigator.share({
        title: target.name,
        text: `Check out ${target.name} on PawRescue`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ description: "Link copied to clipboard!" });
    }
  };

  const filterOptions = [
    { id: "all", label: "All Locations", color: "bg-gray-500" },
    { id: "ngo", label: "NGOs", color: "bg-blue-500" },
    { id: "shelter", label: "Shelters", color: "bg-green-500" },
    { id: "hospital", label: "Hospitals", color: "bg-red-500" }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-urgent/5 via-background to-primary/5">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 animate-fade-in-up text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Live Map & Location Tracking</h1>
          <p className="text-lg text-muted-foreground">
            Find nearby NGOs, hospitals, and shelters with real-time directions
          </p>
        </div>

        {/* Search Bar with Filters */}
        <Card className="card-warm mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for location, NGO, hospital, or shelter..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch} className="btn-trust">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              
              {/* Filter Buttons */}
              <div className="flex gap-2 flex-wrap">
                {filterOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant={filterType === option.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType(option.id)}
                    className={filterType === option.id ? option.color : ""}
                  >
                    <div className={`w-3 h-3 rounded-full ${option.color} mr-2`} />
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Emergency Controls */}
            <Card className="card-warm">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <AlertTriangle className="h-5 w-5 mr-2 text-urgent" />
                  Emergency Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full btn-rescue" 
                  onClick={handleEmergencyAlert}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency Alert
                </Button>
                <Button 
                  className="w-full btn-trust" 
                  onClick={handleGetLocation}
                  disabled={sharing}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  {userLocation ? "Update Location" : "Get My Location"}
                </Button>
                <Button 
                  className="w-full btn-hope" 
                  onClick={handleShareLocation}
                  disabled={!userLocation || sharing}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  {sharing ? "Sharing..." : "Share Location"}
                </Button>
              </CardContent>
            </Card>

            {/* Selected/Searched Location Details Panel */}
            {(searchedLocation || selectedLocation) && (
              <Card className="card-warm border-primary/30">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{(searchedLocation || selectedLocation).name}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => {
                      setSearchedLocation(null);
                      setSelectedLocation(null);
                    }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Location Image */}
                  {searchedLocation && searchedLocation.images && (
                    <div className="relative h-40 rounded-lg overflow-hidden">
                      <img 
                        src={searchedLocation.images[0]} 
                        alt={searchedLocation.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-accent text-accent-foreground">
                          ★ {searchedLocation.rating} ({searchedLocation.totalReviews})
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" className="btn-trust" onClick={handleGetDirections}>
                      <Navigation className="h-3 w-3 mr-1" />
                      Directions
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCall}>
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleSave}>
                      <Bookmark className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleShare}>
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  </div>

                  {/* Quick Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {(searchedLocation || selectedLocation).address}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-accent font-medium">
                        {searchedLocation?.status || "Open 24/7"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {(searchedLocation || selectedLocation).phone}
                      </span>
                    </div>
                  </div>

                  {showDirections && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">Route Information</span>
                        <Badge className="bg-primary">Live</Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Distance:</span>
                          <span className="font-medium">2.3 km</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Est. Time:</span>
                          <span className="font-medium text-accent">8 mins</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Traffic:</span>
                          <span className="text-accent">Moderate</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Map + Details Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            <Card className="card-warm">
              <CardContent className="p-0">
                <EnhancedMapComponent 
                  height="500px" 
                  className="w-full rounded-lg" 
                  onLocationSelect={handleLocationSelect}
                  searchTerm={searchTerm}
                  filterType={filterType}
                  searchedLocation={searchedLocation}
                  showDirections={showDirections}
                />
              </CardContent>
            </Card>

            {/* Detailed Location Information Panel */}
            {searchedLocation && (
              <Card className="card-warm">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full grid grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="hours">Hours</TabsTrigger>
                    <TabsTrigger value="updates">Updates</TabsTrigger>
                    <TabsTrigger value="about">About</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 p-4">
                    <div>
                      <h3 className="font-semibold mb-2">Services</h3>
                      <div className="flex flex-wrap gap-2">
                        {searchedLocation.services.map((service: string, idx: number) => (
                          <Badge key={idx} variant="secondary">{service}</Badge>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Contact Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a href={`tel:${searchedLocation.phone}`} className="text-primary hover:underline">
                            {searchedLocation.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a href={`https://${searchedLocation.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {searchedLocation.website}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{searchedLocation.address}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="hours" className="p-4">
                    <ScrollArea className="h-64">
                      <div className="space-y-3">
                        {Object.entries(searchedLocation.hours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between items-center">
                            <span className="capitalize font-medium">{day}</span>
                            <span className={hours === 'Closed' ? 'text-muted-foreground' : 'text-accent'}>
                              {hours}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="updates" className="p-4">
                    <ScrollArea className="h-64">
                      <div className="space-y-4">
                        {searchedLocation.recentUpdates.map((update: any, idx: number) => (
                          <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">{update.date}</div>
                            <p className="text-sm">{update.text}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="about" className="p-4">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {searchedLocation.description}
                      </p>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Rating:</span>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{searchedLocation.rating} ({searchedLocation.totalReviews} reviews)</span>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Status:</span>
                          <div className="mt-1">
                            <Badge className="bg-accent">{searchedLocation.status}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            )}

            {/* Map Legend */}
            <Card className="card-warm">
              <CardContent className="p-4">
                <div className="flex items-center justify-around text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Shelters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>NGOs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Hospitals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span>Your Location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                    <span>Searched Place</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;