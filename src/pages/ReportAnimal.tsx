import { useState, useEffect } from "react";
import { Camera, MapPin, AlertTriangle, Clock, Phone, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import SplineEmbed from "@/components/SplineEmbed";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const ReportAnimal = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    animalType: "",
    condition: "",
    location: "",
    latitude: null as number | null,
    longitude: null as number | null,
    description: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    isEmergency: false,
    photos: [] as File[]
  });

  // Get current user (optional - can report without login)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUserId(data.session?.user?.id ?? null));
  }, []);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...files] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.animalType || !formData.condition || !formData.location || !formData.description) {
      toast({ description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    if (!formData.contactName || !formData.contactPhone) {
      toast({ description: "Contact information is required", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    try {
      // Upload photos to storage if any
      let imageUrl = null;
      if (formData.photos.length > 0) {
        const file = formData.photos[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `rescue-reports/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);
          imageUrl = publicUrl;
        }
      }

      // Insert rescue report
      const { error: insertError } = await supabase
        .from('rescue_reports')
        .insert({
          animal_type: formData.animalType,
          location: formData.location,
          latitude: formData.latitude,
          longitude: formData.longitude,
          description: `${formData.description}\n\nContact: ${formData.contactName} (${formData.contactPhone}${formData.contactEmail ? ', ' + formData.contactEmail : ''})`,
          urgency: formData.isEmergency ? 'high' : 'medium',
          status: 'pending',
          image_url: imageUrl,
          reporter_id: userId // Can be null if not logged in
        });

      if (insertError) throw insertError;

      toast({ 
        description: "✅ Report submitted successfully! Our rescue network has been notified.",
        duration: 5000
      });

      // Reset form
      setFormData({
        animalType: "",
        condition: "",
        location: "",
        latitude: null,
        longitude: null,
        description: "",
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        isEmergency: false,
        photos: []
      });

    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast({ 
        description: `Failed to submit report: ${error.message}`,
        variant: "destructive" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const emergencyTips = [
    "If the animal is severely injured, contact local emergency vets immediately",
    "Do not approach aggressive or scared animals without proper training",
    "Provide water if safe to do so, but avoid feeding unknown animals",
    "Take photos from a safe distance to help rescuers prepare"
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-urgent/5 via-background to-secondary/5">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-urgent mr-2" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Report Animal in Need</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help us help them. Report stray, injured, or abandoned animals and connect 
            them with our network of rescuers and NGOs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Emergency Tips Sidebar */}
          <div className="lg:order-2 space-y-6">
            <Card className="card-warm">
              <CardContent className="p-4">
                <div className="relative h-[250px] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden">
                  <img 
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/ac68c699-50dc-4969-948e-c865aa87c2ee/generated_images/heartwarming-illustration-of-rescued-ani-e49c6517-20251006125336.jpg"
                    alt="Rescue animal illustration"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                    <p className="text-lg font-bold text-white drop-shadow-lg">Every Report Saves Lives</p>
                    <p className="text-sm text-white/90 drop-shadow-md">Your compassion makes a difference</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-warm sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center text-urgent">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Emergency Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {emergencyTips.map((tip, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <div className="w-2 h-2 bg-urgent rounded-full mt-2 mr-3 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-4 bg-urgent/10 rounded-lg">
                  <div className="flex items-center text-urgent font-medium mb-2">
                    <Phone className="h-4 w-4 mr-2" />
                    Emergency Hotline
                  </div>
                  <p className="text-2xl font-bold text-urgent">1-800-RESCUE</p>
                  <p className="text-sm text-muted-foreground mt-1">24/7 Emergency Response</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2 lg:order-1">
            <Card className="card-warm">
              <CardHeader>
                <CardTitle>Animal Report Form</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Emergency Checkbox */}
                  <div className="flex items-center space-x-2 p-4 bg-urgent/10 rounded-lg border border-urgent/20">
                    <Checkbox 
                      id="emergency" 
                      checked={formData.isEmergency}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isEmergency: checked as boolean }))}
                    />
                    <div className="flex-1">
                      <Label htmlFor="emergency" className="text-urgent font-medium flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        This is an emergency situation
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Check if the animal requires immediate medical attention
                      </p>
                    </div>
                  </div>

                  {/* Animal Type & Condition */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="animalType">Animal Type *</Label>
                      <Select value={formData.animalType} onValueChange={(value) => setFormData(prev => ({ ...prev, animalType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select animal type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dog">Dog</SelectItem>
                          <SelectItem value="cat">Cat</SelectItem>
                          <SelectItem value="bird">Bird</SelectItem>
                          <SelectItem value="rabbit">Rabbit</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition *</Label>
                      <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Animal's condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="injured">Injured</SelectItem>
                          <SelectItem value="sick">Sick</SelectItem>
                          <SelectItem value="abandoned">Abandoned</SelectItem>
                          <SelectItem value="stray">Stray (Healthy)</SelectItem>
                          <SelectItem value="trapped">Trapped</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="Enter precise location or address"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                const { latitude, longitude } = position.coords;
                                setFormData(prev => ({ 
                                  ...prev, 
                                  location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                                  latitude,
                                  longitude
                                }));
                                toast({ description: "📍 Location captured successfully!" });
                              },
                              (error) => {
                                console.error('Error getting location:', error);
                                toast({ description: "Unable to get location", variant: "destructive" });
                              }
                            );
                          }
                        }}
                      >
                        Use Current Location
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Be as specific as possible. Include landmarks or cross streets.
                    </p>
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="photos">Photos</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload clear photos of the animal and situation
                      </p>
                      <Input
                        id="photos"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <Button type="button" variant="outline" onClick={() => document.getElementById('photos')?.click()}>
                        Choose Photos
                      </Button>
                      {formData.photos.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {formData.photos.length} photo(s) selected
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the situation, animal's behavior, any visible injuries, and how long it's been there..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactName">Your Name *</Label>
                        <Input
                          id="contactName"
                          placeholder="Full name"
                          value={formData.contactName}
                          onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Phone Number *</Label>
                        <Input
                          id="contactPhone"
                          placeholder="Your phone number"
                          value={formData.contactPhone}
                          onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.contactEmail}
                          onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={submitting}
                      className={`w-full ${formData.isEmergency ? 'bg-urgent hover:bg-urgent/90' : 'btn-rescue'}`}
                    >
                      <Clock className="h-5 w-5 mr-2" />
                      {submitting 
                        ? 'Submitting...' 
                        : formData.isEmergency 
                          ? 'Submit Emergency Report' 
                          : 'Submit Report'}
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      {userId ? 'Logged in - report will be linked to your account' : 'Reporting as guest (login optional)'}
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportAnimal;