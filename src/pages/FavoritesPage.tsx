import { Link } from "react-router-dom";
import { Heart, MapPin, Calendar, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/hooks/useFavorites";

const FavoritesPage = () => {
  const { favorites, removeFromFavorites } = useFavorites();

  const handleRemoveFavorite = (id: string) => {
    removeFromFavorites(id);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">My Favorites</h1>
          <p className="text-lg text-muted-foreground">Animals you've saved for later</p>
        </div>

        {favorites.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((animal) => (
              <Card key={animal.id} className="card-warm">
                <div className="relative overflow-hidden rounded-t-xl">
                  <img 
                    src={animal.image} 
                    alt={animal.name} 
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveFavorite(animal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{animal.name}</CardTitle>
                    <Badge variant="outline">{animal.type}</Badge>
                  </div>
                  <p className="text-muted-foreground">{animal.breed} • {animal.age}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {animal.location}
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Added {animal.addedDate}
                  </div>
                  <Button asChild className="w-full btn-hope">
                    <Link to={`/animal/${animal.id}`}>
                      View Details <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="card-warm text-center p-12">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-4">
              Start browsing animals and add them to your favorites!
            </p>
            <Button asChild className="btn-hope">
              <Link to="/adopt">Browse Animals</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;