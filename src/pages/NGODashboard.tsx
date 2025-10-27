import { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Filter,
  Search,
  Plus,
  MoreVertical,
  Heart,
  Phone,
  MessageCircle,
  Calendar,
  Users,
  PawPrint,
  Download,
  Edit,
  Trash2,
  Send
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import AddAnimalForm from "@/components/AddAnimalForm";
import AdoptionSection from "@/components/AdoptionSection";
import TeamSection from "@/components/TeamSection";
import { supabase } from "@/integrations/supabase/client";

const NGODashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("reports");
  const [reportFilter, setReportFilter] = useState("all");
  const [showAddAnimalForm, setShowAddAnimalForm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Supabase data states
  const [reports, setReports] = useState<any[]>([]);
  const [animals, setAnimals] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Dialog states
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showAnimalDialog, setShowAnimalDialog] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);
  const [assignTeamDialog, setAssignTeamDialog] = useState(false);
  const [assigningReport, setAssigningReport] = useState<any>(null);
  const [messageDialog, setMessageDialog] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [editAnimalForm, setEditAnimalForm] = useState<any>({});
  const [viewApplicationsDialog, setViewApplicationsDialog] = useState(false);
  const [selectedAnimalApps, setSelectedAnimalApps] = useState<any[]>([]);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUserId(data.session?.user?.id ?? null);
    };
    getUser();
  }, []);

  // Fetch reports
  const fetchReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('rescue_reports')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error(`Error loading reports: ${error.message}`);
    } else {
      setReports(data || []);
    }
    setLoading(false);
  };

  // Fetch animals
  const fetchAnimals = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('animals')
      .select('*')
      .eq('ngo_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error(`Error loading animals: ${error.message}`);
    } else {
      setAnimals(data || []);
    }
  };

  // Fetch team members
  const fetchTeamMembers = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('ngo_id', userId);
    
    if (error) {
      toast.error(`Error loading team: ${error.message}`);
    } else {
      setTeamMembers(data || []);
    }
  };

  // Fetch adoption applications
  const fetchApplications = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('adoption_applications')
      .select(`
        *,
        animals!inner(ngo_id, name, species)
      `)
      .eq('animals.ngo_id', userId);
    
    if (error) {
      toast.error(`Error loading applications: ${error.message}`);
    } else {
      setApplications(data || []);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchAnimals();
    fetchTeamMembers();
    fetchApplications();
  }, [userId]);

  // Update report status
  const updateReportStatus = async (reportId: string, status: string) => {
    const { error } = await supabase
      .from('rescue_reports')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', reportId);
    
    if (error) {
      toast.error(`Error updating report: ${error.message}`);
    } else {
      toast.success(`Report marked as ${status}`);
      fetchReports();
    }
  };

  // Assign team to report
  const assignTeam = async (reportId: string, teamMemberId: string, teamMemberName: string) => {
    const { error } = await supabase
      .from('rescue_reports')
      .update({ assigned_to: teamMemberId, updated_at: new Date().toISOString() })
      .eq('id', reportId);
    
    if (error) {
      toast.error(`Error assigning team: ${error.message}`);
    } else {
      toast.success(`Assigned to ${teamMemberName}`);
      fetchReports();
      setAssignTeamDialog(false);
    }
  };

  // Send message about report
  const sendMessage = async () => {
    if (!messageContent.trim()) {
      toast.error("Please enter a message");
      return;
    }
    // In a real app, this would send an email or notification
    toast.success("Message sent to reporter successfully!");
    setMessageDialog(false);
    setMessageContent("");
  };

  // Update animal
  const updateAnimal = async () => {
    if (!selectedAnimal) return;
    const { error } = await supabase
      .from('animals')
      .update({
        name: editAnimalForm.name,
        species: editAnimalForm.species,
        breed: editAnimalForm.breed,
        age: editAnimalForm.age,
        health_status: editAnimalForm.health_status,
        adoption_status: editAnimalForm.adoption_status
      })
      .eq('id', selectedAnimal.id);
    
    if (error) {
      toast.error(`Error updating animal: ${error.message}`);
    } else {
      toast.success("Animal profile updated successfully!");
      fetchAnimals();
      setShowAnimalDialog(false);
    }
  };

  // Delete animal
  const deleteAnimal = async (animalId: string, animalName: string) => {
    if (!confirm(`Are you sure you want to delete ${animalName}? This cannot be undone.`)) {
      return;
    }
    const { error } = await supabase
      .from('animals')
      .delete()
      .eq('id', animalId);
    
    if (error) {
      toast.error(`Error deleting animal: ${error.message}`);
    } else {
      toast.success("Animal removed from database");
      fetchAnimals();
    }
  };

  // View applications for animal
  const viewAnimalApplications = (animal: any) => {
    const animalApps = applications.filter(app => app.animal_id === animal.id);
    setSelectedAnimalApps(animalApps);
    setViewApplicationsDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'status-urgent';
      case 'pending': return 'status-urgent';
      case 'in-progress': return 'status-pending';
      case 'resolved': return 'status-available';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-urgent text-urgent-foreground';
      case 'critical': return 'bg-urgent text-urgent-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      case 'low': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredReports = reportFilter === "all" ? reports : reports.filter(report => report.status === reportFilter);

  const stats = [
    { label: "Active Reports", value: reports.filter(r => r.status === 'new' || r.status === 'in-progress').length, icon: AlertTriangle, color: "text-urgent" },
    { label: "Animals Rescued", value: animals.length, icon: Heart, color: "text-accent" },
    { label: "Pending Adoptions", value: applications.filter(a => a.status === 'pending').length, icon: Users, color: "text-primary" },
    { label: "Team Members", value: teamMembers.length, icon: Users, color: "text-secondary" }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-secondary/5 via-background to-accent/5">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">NGO Dashboard</h1>
            <p className="text-lg text-muted-foreground">Manage rescue operations and animal adoptions</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={() => {
              const csvData = reports.map(report => 
                `${report.id},${report.animal_type},${report.urgency},${report.location},${report.status}`
              ).join('\n');
              const blob = new Blob([`ID,Animal Type,Urgency,Location,Status\n${csvData}`], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'ngo-reports-export.csv';
              a.click();
              toast.success("Data exported successfully!");
            }}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button className="btn-trust" onClick={() => setShowAddAnimalForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Animal
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="card-warm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reports">Rescue Reports</TabsTrigger>
            <TabsTrigger value="animals">Our Animals</TabsTrigger>
            <TabsTrigger value="adoptions">Adoptions</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex gap-2">
                <Input placeholder="Search reports..." className="w-64" />
                <Select value={reportFilter} onValueChange={setReportFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredReports.map((report) => (
                <Card key={report.id} className="card-warm">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">Report #{report.id.slice(0, 8)}</CardTitle>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status.toUpperCase()}
                          </Badge>
                          <Badge className={getPriorityColor(report.urgency)}>
                            {report.urgency?.toUpperCase() || 'MEDIUM'} PRIORITY
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {report.location}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(report.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            {report.animal_type}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          setSelectedReport(report);
                          setShowReportDialog(true);
                        }}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setSelectedReport(report);
                          setMessageDialog(true);
                        }}>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        {report.assigned_to && (
                          <span><span className="font-medium">Assigned to:</span> Team Member</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {report.status === 'new' && (
                          <>
                            <Button size="sm" className="btn-trust" onClick={() => {
                              setAssigningReport(report);
                              setAssignTeamDialog(true);
                            }}>
                              Assign Team
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => updateReportStatus(report.id, 'in-progress')}>
                              Mark In Progress
                            </Button>
                          </>
                        )}
                        {report.status === 'in-progress' && (
                          <Button size="sm" className="btn-hope" onClick={() => updateReportStatus(report.id, 'resolved')}>
                            Mark Resolved
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Animals Tab */}
          <TabsContent value="animals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Animals in Care</h3>
              <Button className="btn-hope" onClick={() => setShowAddAnimalForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Animal
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {animals.map((animal) => (
                <Card key={animal.id} className="card-warm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{animal.name}</CardTitle>
                      <Badge className={animal.adoption_status === 'available' ? 'status-available' : 'status-pending'}>
                        {animal.adoption_status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{animal.species} • {animal.breed} • {animal.age}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Health:</span> {animal.health_status}
                      </div>
                      <div>
                        <span className="font-medium">Size:</span> {animal.size}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => {
                        setSelectedAnimal(animal);
                        setEditAnimalForm({
                          name: animal.name,
                          species: animal.species,
                          breed: animal.breed,
                          age: animal.age,
                          health_status: animal.health_status,
                          adoption_status: animal.adoption_status
                        });
                        setShowAnimalDialog(true);
                      }}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => deleteAnimal(animal.id, animal.name)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="btn-hope flex-1" onClick={() => navigate(`/animal/${animal.id}`)}>
                        View Profile
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => viewAnimalApplications(animal)}>
                        Applications
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Adoptions Tab */}
          <TabsContent value="adoptions">
            <AdoptionSection />
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <TeamSection />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Report Details Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>Full information about the rescue report</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Report ID</Label>
                  <p className="text-sm">{selectedReport.id}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedReport.status)}>{selectedReport.status}</Badge>
                </div>
                <div>
                  <Label>Animal Type</Label>
                  <p className="text-sm">{selectedReport.animal_type}</p>
                </div>
                <div>
                  <Label>Urgency</Label>
                  <Badge className={getPriorityColor(selectedReport.urgency)}>{selectedReport.urgency}</Badge>
                </div>
                <div className="col-span-2">
                  <Label>Location</Label>
                  <p className="text-sm">{selectedReport.location}</p>
                </div>
                <div className="col-span-2">
                  <Label>Description</Label>
                  <p className="text-sm">{selectedReport.description}</p>
                </div>
                <div className="col-span-2">
                  <Label>Reporter Contact</Label>
                  <p className="text-sm">{selectedReport.contact_info || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowReportDialog(false)}>Close</Button>
                <Button className="btn-trust" onClick={() => {
                  setShowReportDialog(false);
                  setMessageDialog(true);
                }}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Reporter
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={messageDialog} onOpenChange={setMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>Contact the reporter about this case</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Message</Label>
              <Textarea 
                rows={6} 
                placeholder="Type your message here..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMessageDialog(false)}>Cancel</Button>
              <Button className="btn-trust" onClick={sendMessage}>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Team Dialog */}
      <Dialog open={assignTeamDialog} onOpenChange={setAssignTeamDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Team Member</DialogTitle>
            <DialogDescription>Select a team member to handle this report</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <Button
                  key={member.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => assignTeam(assigningReport?.id, member.id, member.name)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  {member.name} - {member.role}
                </Button>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No team members available. Add team members in the Team tab.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Animal Edit Dialog */}
      <Dialog open={showAnimalDialog} onOpenChange={setShowAnimalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Animal Details</DialogTitle>
            <DialogDescription>Update information for {selectedAnimal?.name}</DialogDescription>
          </DialogHeader>
          {selectedAnimal && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input 
                  value={editAnimalForm.name || ''} 
                  onChange={(e) => setEditAnimalForm({...editAnimalForm, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Species</Label>
                <Input 
                  value={editAnimalForm.species || ''} 
                  onChange={(e) => setEditAnimalForm({...editAnimalForm, species: e.target.value})}
                />
              </div>
              <div>
                <Label>Breed</Label>
                <Input 
                  value={editAnimalForm.breed || ''} 
                  onChange={(e) => setEditAnimalForm({...editAnimalForm, breed: e.target.value})}
                />
              </div>
              <div>
                <Label>Age</Label>
                <Input 
                  value={editAnimalForm.age || ''} 
                  onChange={(e) => setEditAnimalForm({...editAnimalForm, age: e.target.value})}
                />
              </div>
              <div>
                <Label>Health Status</Label>
                <Select 
                  value={editAnimalForm.health_status || 'Good'} 
                  onValueChange={(value) => setEditAnimalForm({...editAnimalForm, health_status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Adoption Status</Label>
                <Select 
                  value={editAnimalForm.adoption_status || 'available'} 
                  onValueChange={(value) => setEditAnimalForm({...editAnimalForm, adoption_status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="adopted">Adopted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowAnimalDialog(false)}>Cancel</Button>
                <Button className="btn-trust" onClick={updateAnimal}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Applications Dialog */}
      <Dialog open={viewApplicationsDialog} onOpenChange={setViewApplicationsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Adoption Applications</DialogTitle>
            <DialogDescription>Applications for this animal</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {selectedAnimalApps.length > 0 ? (
              selectedAnimalApps.map((app) => (
                <Card key={app.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{app.applicant_name}</p>
                        <p className="text-sm text-muted-foreground">{app.applicant_email}</p>
                        <p className="text-sm text-muted-foreground">{app.applicant_phone}</p>
                        <Badge className="mt-2">{app.status}</Badge>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{new Date(app.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No applications yet for this animal</p>
              </div>
            )}
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setViewApplicationsDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {showAddAnimalForm && (
        <AddAnimalForm onClose={() => {
          setShowAddAnimalForm(false);
          fetchAnimals();
        }} />
      )}
    </div>
  );
};

export default NGODashboard;