import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Heart, MapPin, Calendar, Info, Bell, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useFavorites } from "@/hooks/useFavorites";

// Mock data for demonstration
const mockAnimals = [
  {
    id: "1",
    name: "Luna",
    type: "Dog",
    breed: "Golden Retriever Mix",
    age: "2 years",
    gender: "Female",
    size: "Large",
    location: "Mumbai, Maharashtra",
    shelter: "Happy Tails Rescue",
    description: "Luna is a gentle, loving dog who gets along well with children and other pets.",
    photos: ["https://images.unsplash.com/photo-1552053831-71594a27632d?w=400"],
    vaccinated: true,
    spayed: true,
    goodWith: ["children", "dogs"],
    energy: "Medium",
    posted: "2 days ago"
  },
  {
    id: "2",
    name: "Whiskers",
    type: "Cat",
    breed: "Persian Mix",
    age: "1 year",
    gender: "Male",
    size: "Medium",
    location: "Delhi, NCR",
    shelter: "Feline Friends Foundation",
    description: "Whiskers is a playful kitten who loves attention and cuddles.",
    photos: ["https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400"],
    vaccinated: true,
    spayed: false,
    goodWith: ["children"],
    energy: "High",
    posted: "1 week ago"
  },
  {
    id: "3",
    name: "Rocky",
    type: "Dog",
    breed: "German Shepherd",
    age: "5 years",
    gender: "Male",
    size: "Large",
    location: "Bangalore, Karnataka",
    shelter: "Second Chance Animal Welfare",
    description: "Rocky is a loyal, well-trained dog looking for an experienced owner.",
    photos: ["https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400"],
    vaccinated: true,
    spayed: true,
    goodWith: ["adults"],
    energy: "Medium",
    posted: "3 days ago"
  },
  {
    id: "4",
    name: "Bella",
    type: "Cat",
    breed: "Siamese",
    age: "3 years",
    gender: "Female",
    size: "Small",
    location: "Chennai, Tamil Nadu",
    shelter: "Loving Paws Sanctuary",
    description: "Bella is a calm, independent cat perfect for a quiet home.",
    photos: ["https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=400"],
    vaccinated: true,
    spayed: true,
    goodWith: ["adults", "older children"],
    energy: "Low",
    posted: "5 days ago"
  },
  {
    id: "5",
    name: "Max",
    type: "Dog",
    breed: "Labrador Mix",
    age: "6 months",
    gender: "Male",
    size: "Medium",
    location: "Pune, Maharashtra",
    shelter: "Pawsome Rescue Center",
    description: "Max is an energetic puppy who loves to play and learn new tricks.",
    photos: ["https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400"],
    vaccinated: true,
    spayed: false,
    goodWith: ["children", "dogs", "cats"],
    energy: "High",
    posted: "1 day ago"
  },
  {
    id: "6",
    name: "Shadow",
    type: "Cat",
    breed: "Black Domestic",
    age: "4 years",
    gender: "Male",
    size: "Medium",
    location: "Kolkata, West Bengal",
    shelter: "Compassionate Care NGO",
    description: "Shadow is a gentle soul who prefers a calm environment.",
    photos: ["https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400"],
    vaccinated: true,
    spayed: true,
    goodWith: ["adults"],
    energy: "Low",
    posted: "1 week ago"
  }
];

const AdoptionListings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    size: "all",
    age: "all",
    location: "all"
  });
  const { addToFavorites, isFavorite } = useFavorites();
  
  const handleSaveToFavorites = (animal: any) => {
    addToFavorites({
      id: animal.id,
      name: animal.name,
      type: animal.type,
      breed: animal.breed,
      age: animal.age,
      location: animal.location,
      image: animal.photos[0],
      addedDate: new Date().toISOString().split('T')[0]
    });
    toast({ description: `${animal.name} saved to favorites!` });
  };

  const handleSetAdoptionAlert = () => {
    toast({ 
      description: "Adoption alert set! We'll notify you when matching pets are available.",
      duration: 3000 
    });
  };

  const handleContactShelters = () => {
    toast({ 
      description: "Contacting shelters in your area. Check your messages for responses.",
      duration: 3000 
    });
  };

  const filteredAnimals = mockAnimals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         animal.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filters.type === "all" || animal.type.toLowerCase() === filters.type;
    const matchesSize = filters.size === "all" || animal.size.toLowerCase() === filters.size;
    
    return matchesSearch && matchesType && matchesSize;
  });

  const getEnergyColor = (energy: string) => {
    switch (energy.toLowerCase()) {
      case 'high': return 'bg-urgent text-urgent-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      case 'low': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Find Your Perfect Companion
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse through our loving animals waiting for their forever homes. 
            Each pet has been health-checked and is ready for adoption.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-lg p-6 mb-8 shadow-md">
          <div className="grid md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or breed..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Animal Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="dog">Dogs</SelectItem>
                <SelectItem value="cat">Cats</SelectItem>
                <SelectItem value="bird">Birds</SelectItem>
                <SelectItem value="rabbit">Rabbits</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.size} onValueChange={(value) => setFilters(prev => ({ ...prev, size: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>

            <Button className="btn-trust" onClick={() => toast({ description: "Filters applied" }) }>
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredAnimals.length} animals available for adoption
          </p>
        </div>

        {/* Animals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnimals.map((animal) => (
            <Card key={animal.id} className="card-warm group cursor-pointer overflow-hidden">
              <div className="relative">
                <img
                  src={animal.photos[0]}
                  alt={animal.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-white/90 backdrop-blur-sm" 
                    onClick={() => handleSaveToFavorites(animal)}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite(animal.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge className="status-available">Available</Badge>
                </div>
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{animal.name}</CardTitle>
                  <Badge variant="outline">{animal.gender}</Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Info className="h-4 w-4 mr-1" />
                  {animal.breed} • {animal.age}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {animal.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={getEnergyColor(animal.energy)}>
                    {animal.energy} Energy
                  </Badge>
                  {animal.vaccinated && (
                    <Badge variant="outline" className="bg-accent text-accent-foreground">
                      Vaccinated
                    </Badge>
                  )}
                  {animal.spayed && (
                    <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                      Spayed/Neutered
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {animal.location}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Posted {animal.posted}
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <Button className="w-full btn-hope" asChild>
                    <Link to={`/animal/${animal.id}`}>
                      Learn More
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => handleSaveToFavorites(animal)}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isFavorite(animal.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    {isFavorite(animal.id) ? 'Saved to Favorites' : 'Save to Favorites'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAnimals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No animals found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or check back later for new additions.
            </p>
            <Button onClick={() => {
              setSearchTerm("");
              setFilters({ type: "all", size: "all", age: "all", location: "all" });
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Can't find the right match?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Register your preferences and we'll notify you when a perfect companion becomes available. 
            You can also check with our partner shelters directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="btn-trust">
                  <Bell className="h-4 w-4 mr-2" />
                  Set Adoption Alerts
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set Adoption Alerts</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Preferred Animal Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dog">Dogs</SelectItem>
                        <SelectItem value="cat">Cats</SelectItem>
                        <SelectItem value="bird">Birds</SelectItem>
                        <SelectItem value="rabbit">Rabbits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Size Preference</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Location Radius</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select radius" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 km</SelectItem>
                        <SelectItem value="15">15 km</SelectItem>
                        <SelectItem value="50">50 km</SelectItem>
                        <SelectItem value="100">100 km</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleSetAdoptionAlert} className="w-full btn-trust">
                    Activate Alerts
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Shelters
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Contact Local Shelters</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    Send a message to shelters in your area about your adoption preferences.
                  </div>
                  <div>
                    <Label>Your Message</Label>
                    <textarea 
                      className="w-full mt-1 p-3 border rounded-md resize-none h-24"
                      placeholder="Hi, I'm looking to adopt a pet and would love to know what animals you have available..."
                    />
                  </div>
                  <Button onClick={handleContactShelters} className="w-full btn-hope">
                    Send to Local Shelters
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdoptionListings;