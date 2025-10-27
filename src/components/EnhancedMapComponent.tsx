import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Navigation, Clock, MapPin, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Enhanced NGO and shelter data for Delhi
const ngoData = [
  {
    id: 1,
    position: [28.6139, 77.2090] as [number, number],
    name: "Delhi Animal Welfare Society",
    type: "shelter",
    address: "Connaught Place, New Delhi",
    phone: "+91-11-2334-5678",
    website: "www.daws.org.in",
    services: ["Emergency Care", "Adoption", "Veterinary Services"],
    capacity: 150,
    currentOccupancy: 120,
    hours: "24/7 Emergency, 9 AM - 6 PM Regular",
    distance: "2.3 km",
    estimatedTime: "8 mins"
  },
  {
    id: 2,
    position: [28.5355, 77.3910] as [number, number],
    name: "Noida Animal Care Center",
    type: "ngo",
    address: "Sector 18, Noida",
    phone: "+91-120-2567-890",
    website: "www.noidaanimals.org",
    services: ["Rescue Operations", "Medical Treatment", "Rehabilitation"],
    capacity: 80,
    currentOccupancy: 65,
    hours: "24/7 Emergency Response",
    distance: "15.2 km",
    estimatedTime: "35 mins"
  },
  {
    id: 3,
    position: [28.4595, 77.0266] as [number, number],
    name: "Gurgaon Pet Rescue Foundation",
    type: "shelter",
    address: "DLF Phase 1, Gurgaon",
    phone: "+91-124-4567-123",
    website: "www.gurgaonpets.com",
    services: ["Pet Adoption", "Training", "Boarding"],
    capacity: 200,
    currentOccupancy: 180,
    hours: "9 AM - 7 PM",
    distance: "28.5 km",
    estimatedTime: "45 mins"
  },
  {
    id: 4,
    position: [28.7041, 77.1025] as [number, number],
    name: "North Delhi Animal Hospital",
    type: "hospital",
    address: "Model Town, Delhi",
    phone: "+91-11-2345-6789",
    website: "www.ndanimalhospital.com",
    services: ["Surgery", "Emergency Care", "Vaccination"],
    capacity: 50,
    currentOccupancy: 35,
    hours: "24/7 Emergency Services",
    distance: "8.7 km",
    estimatedTime: "20 mins"
  },
  {
    id: 5,
    position: [28.6304, 77.2177] as [number, number],
    name: "Central Delhi Street Dog Initiative",
    type: "ngo",
    address: "Karol Bagh, Delhi",
    phone: "+91-11-4567-8901",
    website: "www.cdstreetdogs.org",
    services: ["Street Animal Care", "Sterilization", "Feeding Programs"],
    capacity: 100,
    currentOccupancy: 75,
    hours: "6 AM - 10 PM",
    distance: "1.8 km",
    estimatedTime: "6 mins"
  }
];

const getMarkerColor = (type: string) => {
  switch (type) {
    case 'shelter': return '#22c55e'; // Green
    case 'ngo': return '#3b82f6'; // Blue
    case 'hospital': return '#ef4444'; // Red
    default: return '#6b7280'; // Gray
  }
};

// Custom marker icons for different location types
const createCustomIcon = (color: string) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const locationIcons = {
  shelter: createCustomIcon('green'),
  ngo: createCustomIcon('blue'),
  hospital: createCustomIcon('red'),
  default: createCustomIcon('grey')
};

// User location marker icon
const userIcon = createCustomIcon('violet');

// Red marker for searched location
const searchedLocationIcon = createCustomIcon('red');

// Component to handle map centering and user location tracking
const MapController = ({ userLocation, searchedLocation }: { userLocation: [number, number] | null; searchedLocation: any }) => {
  const map = useMap();
  
  useEffect(() => {
    if (searchedLocation && searchedLocation.lat && searchedLocation.lng) {
      map.setView([searchedLocation.lat, searchedLocation.lng], 14);
    } else if (userLocation) {
      map.setView(userLocation, 13);
    }
  }, [userLocation, searchedLocation, map]);

  return null;
};

interface EnhancedMapComponentProps {
  className?: string;
  height?: string;
  showControls?: boolean;
  onLocationSelect?: (location: any) => void;
  searchTerm?: string;
  filterType?: string;
  searchedLocation?: any;
  showDirections?: boolean;
}

const EnhancedMapComponent = ({ 
  className = "", 
  height = "400px", 
  showControls = true, 
  onLocationSelect,
  searchTerm = "",
  filterType = "all",
  searchedLocation = null,
  showDirections = false
}: EnhancedMapComponentProps) => {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const delhiCenter: [number, number] = [28.6139, 77.2090];

  // Filter locations based on search and type
  const filteredLocations = ngoData.filter(loc => {
    const matchesSearch = searchTerm === "" || 
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || loc.type === filterType;
    return matchesSearch && matchesType;
  });

  // Track user location in real-time
  useEffect(() => {
    if ("geolocation" in navigator) {
      // Get initial position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.error('Error getting location:', error)
      );

      // Watch position for real-time tracking
      const id = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.error('Error watching location:', error),
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
      setWatchId(id);

      return () => {
        if (id) navigator.geolocation.clearWatch(id);
      };
    }
  }, []);

  const handleLocationClick = (location: any) => {
    setSelectedLocation(location);
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  const handleGetDirections = (location: any) => {
    // In a real app, this would integrate with Google Maps or similar
    toast({ 
      description: `Getting directions to ${location.name}. Estimated time: ${location.estimatedTime}`,
      duration: 3000 
    });
    
    // Simulate opening directions in a new tab
    const encodedAddress = encodeURIComponent(location.address);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
  };

  const handleCall = (phone: string) => {
    toast({ description: "Opening phone dialer..." });
    window.location.href = `tel:${phone}`;
  };

  // Calculate route line when directions are shown
  const routeLine: [number, number][] = [];
  if (showDirections && searchedLocation && userLocation) {
    // Simple routing simulation - in production, use a proper routing API
    const latDiff = searchedLocation.lat - userLocation[0];
    const lngDiff = searchedLocation.lng - userLocation[1];
    
    // Create waypoints for a curved path
    for (let i = 0; i <= 10; i++) {
      const progress = i / 10;
      routeLine.push([
        userLocation[0] + latDiff * progress,
        userLocation[1] + lngDiff * progress + Math.sin(progress * Math.PI) * 0.01
      ]);
    }
  }

  return (
    <div className={`${className} rounded-xl overflow-hidden shadow-elegant border border-primary/20`} style={{ height }}>
      <MapContainer
        center={searchedLocation ? [searchedLocation.lat, searchedLocation.lng] : (userLocation || delhiCenter)}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController userLocation={userLocation} searchedLocation={searchedLocation} />

        {/* User Location Marker */}
        {userLocation && (
          <>
            <Marker position={userLocation} icon={userIcon}>
              <Popup>
                <div className="text-center">
                  <User className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="font-medium">Your Location</p>
                  <p className="text-xs text-muted-foreground">Live tracking active</p>
                </div>
              </Popup>
            </Marker>
            {/* Accuracy circle */}
            <Circle
              center={userLocation}
              radius={50}
              pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1 }}
            />
          </>
        )}

        {/* Searched Location Red Marker */}
        {searchedLocation && searchedLocation.lat && searchedLocation.lng && (
          <>
            <Marker 
              position={[searchedLocation.lat, searchedLocation.lng]} 
              icon={searchedLocationIcon}
            >
              <Popup className="custom-popup" minWidth={320}>
                <Card className="border-0 shadow-none">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-base text-foreground">{searchedLocation.name}</h3>
                          <p className="text-sm text-muted-foreground">{searchedLocation.address}</p>
                        </div>
                        <Badge variant="outline" className="bg-red-500/20 border-red-500">
                          SEARCHED
                        </Badge>
                      </div>

                      {searchedLocation.services && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">SERVICES</p>
                          <div className="flex flex-wrap gap-1">
                            {searchedLocation.services.map((service: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCall(searchedLocation.phone)}
                          className="text-xs"
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                        <Button
                          size="sm"
                          className="text-xs btn-trust"
                        >
                          <Navigation className="h-3 w-3 mr-1" />
                          Directions
                        </Button>
                      </div>

                      {searchedLocation.status && (
                        <div className="flex items-center justify-center pt-2 border-t border-border">
                          <Clock className="h-3 w-3 mr-1 text-primary" />
                          <span className="text-xs text-primary font-medium">
                            {searchedLocation.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Popup>
            </Marker>
            {/* Highlight circle for searched location */}
            <Circle
              center={[searchedLocation.lat, searchedLocation.lng]}
              radius={100}
              pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1 }}
            />
          </>
        )}

        {/* Live Directions Route Line */}
        {showDirections && routeLine.length > 0 && (
          <Polyline
            positions={routeLine}
            pathOptions={{
              color: '#3b82f6',
              weight: 4,
              opacity: 0.8,
              dashArray: '10, 10',
              lineCap: 'round',
              lineJoin: 'round'
            }}
          />
        )}
        
        {filteredLocations.map((location) => {
          const icon = locationIcons[location.type as keyof typeof locationIcons] || locationIcons.default;
          return (
          <Marker
            key={location.id}
            position={location.position}
            icon={icon}
          >
            <Popup className="custom-popup" minWidth={320}>
              <Card className="border-0 shadow-none">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-base text-foreground">{location.name}</h3>
                        <p className="text-sm text-muted-foreground">{location.address}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        style={{ backgroundColor: getMarkerColor(location.type) + '20', borderColor: getMarkerColor(location.type) }}
                      >
                        {location.type.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Services */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">SERVICES</p>
                      <div className="flex flex-wrap gap-1">
                        {location.services.map((service, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Capacity & Hours */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="font-medium text-muted-foreground">CAPACITY</p>
                        <p className="text-foreground">{location.currentOccupancy}/{location.capacity}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">DISTANCE</p>
                        <p className="text-foreground">{location.distance}</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-muted-foreground text-xs">HOURS</p>
                      <p className="text-xs text-foreground">{location.hours}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCall(location.phone)}
                        className="text-xs"
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleGetDirections(location)}
                        className="text-xs btn-trust"
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Directions
                      </Button>
                    </div>

                    {/* Estimated Time */}
                    <div className="flex items-center justify-center pt-2 border-t border-border">
                      <Clock className="h-3 w-3 mr-1 text-primary" />
                      <span className="text-xs text-primary font-medium">
                        Est. {location.estimatedTime} away
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Popup>
          </Marker>
        );
        })}
      </MapContainer>
    </div>
  );
};

export default EnhancedMapComponent;