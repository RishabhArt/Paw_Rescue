import { Link } from "react-router-dom";
import { ArrowRight, Heart, Shield, Users, MapPin, Camera, MessageCircle, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Home = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [savedEvents, setSavedEvents] = useState<{[key: string]: {title: string, note: string}}>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSaveEvent = (date: Date, title: string, note: string) => {
    const dateKey = date.toISOString().split('T')[0];
    setSavedEvents({ ...savedEvents, [dateKey]: { title, note } });
    toast.success("Event saved to calendar!");
  };

  const features = [
    {
      icon: Camera,
      title: "Report with Photos",
      description: "Upload photos and precise location of animals in need of rescue",
      color: "text-urgent"
    },
    {
      icon: Shield,
      title: "Real-time Alerts",
      description: "NGOs and rescuers get instant notifications for emergency cases",
      color: "text-secondary"
    },
    {
      icon: Heart,
      title: "Find Your Match",
      description: "Browse detailed profiles of animals ready for loving homes",
      color: "text-primary"
    },
    {
      icon: MessageCircle,
      title: "Direct Communication",
      description: "Chat directly with shelters and NGOs about adoptions",
      color: "text-accent"
    }
  ];

  const stats = [
    { number: "2,500+", label: "Animals Rescued", icon: Shield },
    { number: "1,800+", label: "Successful Adoptions", icon: Heart },
    { number: "150+", label: "Partner NGOs", icon: Users },
    { number: "50+", label: "Cities Covered", icon: MapPin }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10 text-center lg:text-left animate-fade-in-up space-y-8">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Every Animal Deserves a 
                  <span className="block text-primary-glow paw-print"> Second Chance</span>
                </h1>
                <p className="text-xl text-white/90 mb-8 max-w-2xl">
                  Connect rescuers, shelters, and animal lovers in one platform. 
                  Report emergencies, find adoptable pets, and help build a community 
                  that saves lives every day.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button size="lg" className="btn-rescue text-lg px-8 py-3" asChild>
                    <Link to="/report">
                      Report Emergency <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
                    <Link to="/adopt">
                      Find a Pet <Heart className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Quick Stats Cards on Left */}
              <div className="grid grid-cols-2 gap-4 pt-8">
                {stats.slice(0, 4).map((stat, index) => (
                  <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardContent className="p-4 text-center">
                      <stat.icon className="h-6 w-6 text-white mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                      <div className="text-xs text-white/80">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Mission Statement Card */}
              <Card className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/40 to-primary/40 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Our Mission</h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      PawRescue bridges the gap between distressed animals and those who can help. 
                      We provide real-time rescue coordination, facilitate adoptions, and build a 
                      compassionate community dedicated to animal welfare across India.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Quick Action Cards */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <Shield className="h-8 w-8 text-white mx-auto mb-2" />
                    <div className="text-sm font-semibold text-white">24/7</div>
                    <div className="text-xs text-white/80">Emergency</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 text-white mx-auto mb-2" />
                    <div className="text-sm font-semibold text-white">Active</div>
                    <div className="text-xs text-white/80">Community</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <MapPin className="h-8 w-8 text-white mx-auto mb-2" />
                    <div className="text-sm font-semibold text-white">50+</div>
                    <div className="text-xs text-white/80">Cities</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="relative z-10 animate-float space-y-6">
              {/* Real-time Clock Widget on Right */}
              <Card className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/30">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Live Time & Calendar</h3>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-4">
                    <div className="text-4xl font-bold text-white mb-2 font-mono">
                      {currentTime.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        second: '2-digit',
                        hour12: true 
                      })}
                    </div>
                    <div className="text-white/80 text-base">
                      {currentTime.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <DialogTrigger asChild>
                      <Button variant="secondary" size="lg" className="w-full">
                        <CalendarIcon className="h-5 w-5 mr-2" />
                        Open Calendar & Events
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Calendar & Events</DialogTitle>
                      </DialogHeader>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Calendar
                            mode="single"
                            selected={calendarDate}
                            onSelect={setCalendarDate}
                            className="rounded-md border"
                          />
                        </div>
                        <div className="space-y-4">
                          {calendarDate && (
                            <>
                              <div>
                                <h3 className="font-semibold mb-2">
                                  Selected: {calendarDate.toLocaleDateString('en-US', { 
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </h3>
                                <div className="space-y-3">
                                  <div>
                                    <Label>Event Title</Label>
                                    <Input 
                                      id="eventTitle"
                                      placeholder="e.g., Rescue visit, Adoption meeting"
                                    />
                                  </div>
                                  <div>
                                    <Label>Event Note</Label>
                                    <Textarea 
                                      id="eventNote"
                                      placeholder="Add details about this event..."
                                      rows={4}
                                    />
                                  </div>
                                  <Button 
                                    className="w-full"
                                    onClick={() => {
                                      const titleInput = document.getElementById('eventTitle') as HTMLInputElement;
                                      const noteInput = document.getElementById('eventNote') as HTMLTextAreaElement;
                                      if (titleInput.value && calendarDate) {
                                        handleSaveEvent(calendarDate, titleInput.value, noteInput.value);
                                        titleInput.value = '';
                                        noteInput.value = '';
                                      }
                                    }}
                                  >
                                    Save Event
                                  </Button>
                                </div>
                              </div>
                              {(() => {
                                const dateKey = calendarDate.toISOString().split('T')[0];
                                const event = savedEvents[dateKey];
                                return event ? (
                                  <div className="mt-4 p-4 bg-muted rounded-lg">
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Saved Event:</h4>
                                    <p className="font-medium">{event.title}</p>
                                    {event.note && <p className="text-sm text-muted-foreground mt-1">{event.note}</p>}
                                  </div>
                                ) : null;
                              })()}
                            </>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>

              {/* Hero Image Card */}
              <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/30">
                <div className="text-center">
                  {/* Weather-like info panel */}
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-white mb-1">Delhi, India</h3>
                        <p className="text-white/80 text-sm">Rescue Operations Active</p>
                        <p className="text-white/60 text-xs">24/7 Emergency Response</p>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-accent/30 to-primary/30 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🐾</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hero Image */}
                  <div className="relative mx-auto w-full h-64">
                    <img
                      src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/ac68c699-50dc-4969-948e-c865aa87c2ee/generated_images/heartwarming-photo-of-diverse-rescued-an-07a3a4c4-20251006124735.jpg"
                      alt="PawRescue animal rescue hero preview"
                      loading="lazy"
                      className="w-full h-full object-cover rounded-2xl border border-white/20 shadow-[var(--shadow-glass)]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent pointer-events-none rounded-2xl" />
                    <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                      <Button asChild size="sm" className="btn-rescue">
                        <Link to="/report">Report</Link>
                      </Button>
                      <Button asChild size="sm" className="btn-trust">
                        <Link to="/live-map">Map</Link>
                      </Button>
                      <Button asChild size="sm" className="btn-hope">
                        <Link to="/adopt">Adopt</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Platform Features Card */}
              <Card className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/30">
                <h3 className="text-lg font-bold text-white mb-4 text-center">Platform Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <Camera className="h-5 w-5 text-white flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-white">Photo & GPS Reporting</p>
                      <p className="text-xs text-white/70">Precise location tracking</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <Shield className="h-5 w-5 text-white flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-white">Instant Alerts</p>
                      <p className="text-xs text-white/70">Real-time notifications</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <MessageCircle className="h-5 w-5 text-white flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-white">Direct Messaging</p>
                      <p className="text-xs text-white/70">Connect with NGOs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <Heart className="h-5 w-5 text-white flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-white">Adoption Portal</p>
                      <p className="text-xs text-white/70">Find your perfect pet</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How PawRescue Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform connects all stakeholders in animal rescue and adoption, 
              creating a seamless experience that saves time and lives.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-warm text-center group cursor-pointer" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-8">
                  <feature.icon className={`h-12 w-12 ${feature.color} mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`} />
                  <h3 className="text-xl font-semibold text-foreground mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're reporting an animal in need, looking to adopt, 
            or representing an NGO, join our community today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-rescue" asChild>
              <Link to="/report">Start Reporting</Link>
            </Button>
            <Button size="lg" className="btn-trust" asChild>
              <Link to="/ngo-dashboard">NGO Partnership</Link>
            </Button>
            <Button size="lg" className="btn-hope" asChild>
              <Link to="/adopt">Adopt Today</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;