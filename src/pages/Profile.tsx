import { useState, useEffect, useRef } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Edit,
  Save,
  Heart,
  Award,
  Calendar,
  TrendingUp,
  Settings as SettingsIcon,
  Bell,
  Shield,
  LogOut,
  Activity,
  ImagePlus
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    avatar: ""
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    adoptionAlerts: true,
    rescueUpdates: true,
    newsletter: false
  });

  const mockStats = {
    animalsHelped: 23,
    adoptions: 2,
    donations: 8,
    reportsSubmitted: 15
  };

  const badges = [
    { name: "Animal Advocate", icon: "🏆", color: "bg-primary", description: "Helped 20+ animals" },
    { name: "Rescue Hero", icon: "🦸", color: "bg-secondary", description: "Submitted 10+ rescue reports" },
    { name: "Adoption Champion", icon: "💝", color: "bg-accent", description: "Successfully adopted 2+ pets" }
  ];

  // Avatar options for selection
  const avatarOptions = [
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Luna`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Midnight`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Bella`,
    `https://api.dicebear.com/7.x/adventurer/svg?seed=Max`,
    `https://api.dicebear.com/7.x/adventurer/svg?seed=Charlie`,
    `https://api.dicebear.com/7.x/adventurer/svg?seed=Daisy`,
    `https://api.dicebear.com/7.x/adventurer/svg?seed=Rocky`,
    `https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe`,
    `https://api.dicebear.com/7.x/adventurer/svg?seed=Cooper`,
    `https://api.dicebear.com/7.x/fun-emoji/svg?seed=Milo`,
    `https://api.dicebear.com/7.x/fun-emoji/svg?seed=Sophie`,
    `https://api.dicebear.com/7.x/fun-emoji/svg?seed=Oliver`,
    `https://api.dicebear.com/7.x/fun-emoji/svg?seed=Lily`,
    `https://api.dicebear.com/7.x/bottts/svg?seed=Robot1`,
    `https://api.dicebear.com/7.x/bottts/svg?seed=Robot2`,
    `https://api.dicebear.com/7.x/personas/svg?seed=Person1`,
    `https://api.dicebear.com/7.x/personas/svg?seed=Person2`,
  ];

  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraPopoverOpen, setCameraPopoverOpen] = useState(false);

  const adoptedPets = [
    {
      id: "1",
      name: "Luna",
      type: "Dog",
      breed: "Golden Retriever Mix", 
      adoptedDate: "2023-08-15",
      photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400"
    },
    {
      id: "2",
      name: "Whiskers",
      type: "Cat",
      breed: "Maine Coon",
      adoptedDate: "2023-11-20",
      photo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400"
    }
  ];

  const activityTimeline = [
    { date: "2024-01-15", action: "Reported injured dog", location: "Downtown Park", icon: "📍" },
    { date: "2024-01-10", action: "Adopted Whiskers", location: "City Shelter", icon: "🏠" },
    { date: "2024-01-05", action: "Donated $50", location: "Animal Welfare Fund", icon: "💰" },
    { date: "2023-12-28", action: "Volunteered at rescue event", location: "Community Center", icon: "🤝" },
  ];

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const savedProfile = localStorage.getItem('pawrescue_profile');
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        } else {
          setProfile({
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || "",
            email: user.email || "",
            phone: "",
            location: "",
            bio: "",
            avatar: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
          });
        }
      }

      const savedPrefs = localStorage.getItem('pawrescue_preferences');
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
    };

    loadUserData();
  }, []);

  const handleSave = () => {
    localStorage.setItem('pawrescue_profile', JSON.stringify(profile));
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (key: string, value: boolean) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    localStorage.setItem('pawrescue_preferences', JSON.stringify(newPrefs));
    toast.success("Preferences updated!");
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    const newProfile = { ...profile, avatar: avatarUrl };
    setProfile(newProfile);
    localStorage.setItem('pawrescue_profile', JSON.stringify(newProfile));
    setAvatarDialogOpen(false);
    toast.success("Profile picture updated!");
    // Notify Navigation component
    window.dispatchEvent(new Event('profileUpdated'));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      const newProfile = { ...profile, avatar: url };
      setProfile(newProfile);
      localStorage.setItem('pawrescue_profile', JSON.stringify(newProfile));
      toast.success("Profile picture uploaded!");
      // Notify Navigation component
      window.dispatchEvent(new Event('profileUpdated'));
    };
    reader.readAsDataURL(file);
    setCameraPopoverOpen(false);
  };

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-lg text-muted-foreground">Manage your account and track your impact</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="card-warm">
              <CardContent className="p-6">
                {/* Profile Header */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    <Avatar className="h-32 w-32 border-4 border-primary/10">
                      <AvatarImage src={profile.avatar} />
                      <AvatarFallback className="text-2xl bg-primary/10">
                        {profile.name.split(' ').map(n => n[0]).join('').toUpperCase() || '??'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="absolute -bottom-2 -right-2 flex gap-1">
                      {/* Camera/Upload Options Popover */}
                      <Popover open={cameraPopoverOpen} onOpenChange={setCameraPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button 
                            size="sm" 
                            className="rounded-full h-10 w-10 p-0 shadow-lg"
                            variant="default"
                            type="button"
                          >
                            <Camera className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-2" align="end">
                          <div className="space-y-1">
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={handleCameraCapture}
                            >
                              <Camera className="h-4 w-4 mr-2" />
                              Take a Picture
                            </Button>
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={handleFileSelect}
                            >
                              <ImagePlus className="h-4 w-4 mr-2" />
                              Select from Images
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>

                      {/* Hidden file inputs */}
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />

                      {/* Select Avatar Button */}
                      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            className="rounded-full h-10 w-10 p-0"
                            variant="outline"
                            type="button"
                          >
                            <ImagePlus className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Choose Your Avatar</DialogTitle>
                            <DialogDescription>
                              Select from our collection of avatars
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 p-4">
                            {avatarOptions.map((avatarUrl, index) => (
                              <button
                                key={index}
                                onClick={() => handleAvatarSelect(avatarUrl)}
                                className="group relative aspect-square rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-all hover:scale-105"
                              >
                                <img 
                                  src={avatarUrl} 
                                  alt={`Avatar ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                              </button>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-2">{profile.name || "Anonymous User"}</h2>
                    <p className="text-sm text-muted-foreground mb-1">{profile.email}</p>
                    <Badge variant="secondary" className="mt-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      Joined March 2023
                    </Badge>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Quick Stats */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Your Impact</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-primary/5 rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{mockStats.animalsHelped}</div>
                      <div className="text-xs text-muted-foreground">Animals Helped</div>
                    </div>
                    <div className="p-3 bg-secondary/5 rounded-lg text-center">
                      <div className="text-2xl font-bold text-secondary">{mockStats.adoptions}</div>
                      <div className="text-xs text-muted-foreground">Adoptions</div>
                    </div>
                    <div className="p-3 bg-accent/5 rounded-lg text-center">
                      <div className="text-2xl font-bold text-accent">{mockStats.donations}</div>
                      <div className="text-xs text-muted-foreground">Donations</div>
                    </div>
                    <div className="p-3 bg-urgent/5 rounded-lg text-center">
                      <div className="text-2xl font-bold text-urgent">{mockStats.reportsSubmitted}</div>
                      <div className="text-xs text-muted-foreground">Reports</div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Quick Actions */}
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/settings")}>
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-destructive" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            <Card className="card-warm">
              <CardContent className="p-6">
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="grid w-full grid-cols-5 mb-6">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="achievements">Badges</TabsTrigger>
                    <TabsTrigger value="pets">Pets</TabsTrigger>
                    <TabsTrigger value="preferences">Settings</TabsTrigger>
                  </TabsList>

                  {/* Profile Tab */}
                  <TabsContent value="profile" className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Personal Information</h3>
                      <Button 
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        size="sm"
                      >
                        {isEditing ? <><Save className="h-4 w-4 mr-2" />Save</> : <><Edit className="h-4 w-4 mr-2" />Edit</>}
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location
                        </Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => handleChange('location', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        rows={4}
                        value={profile.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Tell us about yourself and your love for animals..."
                      />
                    </div>
                  </TabsContent>

                  {/* Activity Tab */}
                  <TabsContent value="activity" className="space-y-4">
                    <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {activityTimeline.map((activity, index) => (
                        <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="text-3xl">{activity.icon}</div>
                            <div className="flex-1">
                              <p className="font-medium">{activity.action}</p>
                              <p className="text-sm text-muted-foreground">{activity.location}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                <Calendar className="inline h-3 w-3 mr-1" />
                                {new Date(activity.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Achievements Tab */}
                  <TabsContent value="achievements" className="space-y-4">
                    <h3 className="text-xl font-semibold mb-4">Your Badges</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {badges.map((badge, index) => (
                        <Card key={index} className={`p-6 ${badge.color}/10 border-${badge.color}`}>
                          <div className="flex items-center gap-4">
                            <div className="text-5xl">{badge.icon}</div>
                            <div className="flex-1">
                              <h4 className="font-bold text-lg">{badge.name}</h4>
                              <p className="text-sm text-muted-foreground">{badge.description}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <Card className="p-6 mt-6 bg-muted/30">
                      <div className="text-center">
                        <TrendingUp className="h-12 w-12 mx-auto mb-3 text-primary" />
                        <h4 className="font-semibold mb-2">Keep Going!</h4>
                        <p className="text-sm text-muted-foreground">
                          Complete more actions to unlock new badges and achievements
                        </p>
                      </div>
                    </Card>
                  </TabsContent>

                  {/* Pets Tab */}
                  <TabsContent value="pets" className="space-y-4">
                    <h3 className="text-xl font-semibold mb-4">My Adopted Pets</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {adoptedPets.map((pet) => (
                        <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <img src={pet.photo} alt={pet.name} className="w-full h-48 object-cover" />
                          <CardContent className="p-4">
                            <h4 className="font-bold text-lg mb-1">{pet.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{pet.breed}</p>
                            <Badge variant="secondary">
                              <Calendar className="h-3 w-3 mr-1" />
                              Adopted {new Date(pet.adoptedDate).toLocaleDateString()}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    {adoptedPets.length === 0 && (
                      <Card className="p-8 text-center bg-muted/30">
                        <Heart className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-muted-foreground">You haven't adopted any pets yet</p>
                        <Button className="mt-4" onClick={() => navigate("/adopt")}>
                          Browse Available Pets
                        </Button>
                      </Card>
                    )}
                  </TabsContent>

                  {/* Preferences Tab */}
                  <TabsContent value="preferences" className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Notification Preferences</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive updates via email</p>
                          </div>
                        </div>
                        <Switch
                          checked={preferences.emailNotifications}
                          onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Bell className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Push Notifications</p>
                            <p className="text-sm text-muted-foreground">Get instant alerts</p>
                          </div>
                        </div>
                        <Switch
                          checked={preferences.pushNotifications}
                          onCheckedChange={(checked) => handlePreferenceChange('pushNotifications', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Heart className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Adoption Alerts</p>
                            <p className="text-sm text-muted-foreground">New animals available for adoption</p>
                          </div>
                        </div>
                        <Switch
                          checked={preferences.adoptionAlerts}
                          onCheckedChange={(checked) => handlePreferenceChange('adoptionAlerts', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Activity className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Rescue Updates</p>
                            <p className="text-sm text-muted-foreground">Track rescue report progress</p>
                          </div>
                        </div>
                        <Switch
                          checked={preferences.rescueUpdates}
                          onCheckedChange={(checked) => handlePreferenceChange('rescueUpdates', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Newsletter</p>
                            <p className="text-sm text-muted-foreground">Weekly animal welfare newsletter</p>
                          </div>
                        </div>
                        <Switch
                          checked={preferences.newsletter}
                          onCheckedChange={(checked) => handlePreferenceChange('newsletter', checked)}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;