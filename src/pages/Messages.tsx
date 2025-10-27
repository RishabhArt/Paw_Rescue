import { useState, useEffect } from "react";
import { 
  Search, Mail, Inbox, Star, Clock, Send, FileText, Archive, 
  Trash2, AlertCircle, ShoppingCart, Users, Calendar as CalendarIcon,
  Settings, HelpCircle, Video, MessageSquare, Edit, MoreVertical,
  ArrowLeft, Reply, Forward, Smile, Tag, Bell, Printer, Sun,
  Flag, Pause, ListChecks, Volume2, User, Phone, MapPin, Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  from: string;
  subject: string;
  preview: string;
  content: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  category: string;
  labels: string[];
}

const Messages = () => {
  const [selectedFolder, setSelectedFolder] = useState("inbox");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [savedEvents, setSavedEvents] = useState<{[key: string]: string}>({});
  const [contactsOpen, setContactsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [subscriptionsOpen, setSubscriptionsOpen] = useState(false);
  
  // Mock messages - in production, fetch from Supabase
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      from: "PawRescue Team",
      subject: "Welcome to PawRescue Messages",
      preview: "Thank you for joining our platform. Here's how to get started...",
      content: "Welcome to PawRescue! This is your message center where you can communicate with NGOs, shelters, and other animal lovers.",
      timestamp: new Date(),
      read: false,
      starred: true,
      category: "primary",
      labels: ["important"]
    },
    {
      id: "2",
      from: "Delhi Animal Shelter",
      subject: "Adoption Application Update",
      preview: "Your application for Max has been approved!",
      content: "Great news! Your adoption application for Max the Golden Retriever has been approved. Please contact us to schedule a meeting.",
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      starred: false,
      category: "primary",
      labels: []
    }
  ]);

  // Mock contacts data
  const contacts = [
    { id: "1", name: "Delhi Animal Shelter", email: "contact@delhishelter.org", phone: "+91-98765-43210", type: "NGO" },
    { id: "2", name: "Mumbai Pet Rescue", email: "info@mumbaipets.org", phone: "+91-98765-43211", type: "NGO" },
    { id: "3", name: "Bangalore Animal Care", email: "care@bangalorepets.org", phone: "+91-98765-43212", type: "Shelter" },
  ];

  // Mock subscriptions
  const subscriptions = [
    { id: "1", name: "Rescue Alerts", description: "Get notified about new rescue cases", enabled: true },
    { id: "2", name: "Adoption Updates", description: "Updates on new animals available for adoption", enabled: true },
    { id: "3", name: "Newsletter", description: "Weekly newsletter with success stories", enabled: false },
    { id: "4", name: "Event Notifications", description: "Upcoming adoption events and meetups", enabled: true },
  ];

  const folders = [
    { id: "inbox", icon: Inbox, label: "Inbox", count: messages.filter(m => m.category === "primary" && !m.read).length },
    { id: "starred", icon: Star, label: "Starred", count: messages.filter(m => m.starred).length },
    { id: "snoozed", icon: Clock, label: "Snoozed", count: 0 },
    { id: "important", icon: Flag, label: "Important", count: messages.filter(m => m.labels.includes("important")).length },
    { id: "sent", icon: Send, label: "Sent", count: 0 },
    { id: "scheduled", icon: Clock, label: "Scheduled", count: 0 },
    { id: "outbox", icon: Mail, label: "Outbox", count: 0 },
    { id: "drafts", icon: FileText, label: "Drafts", count: 0 },
    { id: "all-mail", icon: Mail, label: "All Mail", count: messages.length },
    { id: "spam", icon: AlertCircle, label: "Spam", count: 0 },
    { id: "bin", icon: Trash2, label: "Bin", count: 0 }
  ];

  const categories = [
    { id: "primary", icon: Inbox, label: "Primary", color: "text-blue-500" },
    { id: "promotions", icon: Tag, label: "Promotions", color: "text-green-500" },
    { id: "social", icon: Users, label: "Social", color: "text-purple-500" },
    { id: "updates", icon: Bell, label: "Updates", color: "text-orange-500" },
    { id: "purchases", icon: ShoppingCart, label: "Purchases", color: "text-pink-500" }
  ];

  const emojis = ["😊", "❤️", "👍", "🎉", "🐕", "🐈", "🙏", "✨", "🌟", "💕"];

  const filteredMessages = messages.filter(msg => {
    if (searchQuery) {
      return msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
             msg.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
             msg.content.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    switch (selectedFolder) {
      case "inbox":
        return msg.category === "primary";
      case "starred":
        return msg.starred;
      case "important":
        return msg.labels.includes("important");
      case "all-mail":
        return true;
      default:
        return msg.category === selectedFolder;
    }
  });

  const handleArchive = () => {
    if (selectedMessage) {
      setMessages(messages.filter(m => m.id !== selectedMessage.id));
      setSelectedMessage(null);
      toast.success("Message archived");
    }
  };

  const handleDelete = () => {
    if (selectedMessage) {
      setMessages(messages.filter(m => m.id !== selectedMessage.id));
      setSelectedMessage(null);
      toast.success("Message moved to bin");
    }
  };

  const handleStar = () => {
    if (selectedMessage) {
      setMessages(messages.map(m => 
        m.id === selectedMessage.id ? { ...m, starred: !m.starred } : m
      ));
      setSelectedMessage({ ...selectedMessage, starred: !selectedMessage.starred });
      toast.success(selectedMessage.starred ? "Removed from starred" : "Added to starred");
    }
  };

  const handleSaveEvent = (date: Date, note: string) => {
    const dateKey = date.toISOString().split('T')[0];
    setSavedEvents({ ...savedEvents, [dateKey]: note });
    toast.success("Event saved to calendar");
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="border-b px-4 py-3 flex items-center gap-4">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Mail className="h-6 w-6 text-primary" />
          PawRescue Mail
        </h1>
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search in mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button onClick={() => setComposeOpen(true)} className="btn-rescue">
          <Edit className="h-4 w-4 mr-2" />
          Compose
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-muted/20 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-1">
              {/* Main Folders */}
              {folders.map((folder) => (
                <Button
                  key={folder.id}
                  variant={selectedFolder === folder.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedFolder(folder.id);
                    setSelectedMessage(null);
                  }}
                >
                  <folder.icon className="h-4 w-4 mr-2" />
                  {folder.label}
                  {folder.count > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {folder.count}
                    </Badge>
                  )}
                </Button>
              ))}

              <Separator className="my-4" />

              {/* Categories */}
              <div className="text-sm font-medium text-muted-foreground mb-2">Categories</div>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedFolder === cat.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedFolder(cat.id);
                    setSelectedMessage(null);
                  }}
                >
                  <cat.icon className={`h-4 w-4 mr-2 ${cat.color}`} />
                  {cat.label}
                </Button>
              ))}

              <Separator className="my-4" />

              {/* Additional Features */}
              <div className="text-sm font-medium text-muted-foreground mb-2">More</div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Calendar
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={calendarDate}
                    onSelect={setCalendarDate}
                    className="rounded-md border"
                  />
                  {calendarDate && (
                    <div className="p-3 border-t">
                      <Label className="text-xs">Add Note</Label>
                      <Input
                        placeholder="Event note..."
                        className="mt-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && calendarDate) {
                            handleSaveEvent(calendarDate, e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Press Enter to save
                      </p>
                    </div>
                  )}
                </PopoverContent>
              </Popover>

              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setContactsOpen(true)}
              >
                <Users className="h-4 w-4 mr-2" />
                Contacts
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setHelpOpen(true)}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Help & Feedback
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setSubscriptionsOpen(true)}
              >
                <Tag className="h-4 w-4 mr-2" />
                Manage Subscriptions
              </Button>
            </div>
          </ScrollArea>

          {/* Bottom Actions */}
          <div className="p-4 border-t space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setVideoOpen(true)}
            >
              <Video className="h-4 w-4 mr-2" />
              Video Chat
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setChatOpen(!chatOpen)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </Button>
          </div>
        </aside>

        {/* Message List */}
        <div className="w-96 border-r flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg capitalize">{selectedFolder}</h2>
            <p className="text-sm text-muted-foreground">
              {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
            </p>
          </div>
          <ScrollArea className="flex-1">
            {filteredMessages.map((msg) => (
              <Card
                key={msg.id}
                className={`m-2 cursor-pointer transition-colors ${
                  selectedMessage?.id === msg.id ? 'border-primary' : ''
                } ${!msg.read ? 'bg-accent/5' : ''}`}
                onClick={() => {
                  setSelectedMessage(msg);
                  setMessages(messages.map(m => 
                    m.id === msg.id ? { ...m, read: true } : m
                  ));
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${!msg.read ? 'font-bold' : ''}`}>
                          {msg.from}
                        </span>
                        {msg.starred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                      </div>
                      <h3 className={`text-sm mt-1 ${!msg.read ? 'font-semibold' : ''}`}>
                        {msg.subject}
                      </h3>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {msg.preview}
                  </p>
                  {msg.labels.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {msg.labels.map((label) => (
                        <Badge key={label} variant="outline" className="text-xs">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </div>

        {/* Message View */}
        <div className="flex-1 flex flex-col">
          {selectedMessage ? (
            <>
              {/* Message Actions */}
              <div className="border-b p-3 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedMessage(null)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleArchive}>
                  <Archive className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleStar}>
                  <Star className={`h-4 w-4 ${selectedMessage.starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem>
                      <Archive className="h-4 w-4 mr-2" />
                      Move to
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Tag className="h-4 w-4 mr-2" />
                      Label as
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleStar}>
                      <Flag className="h-4 w-4 mr-2" />
                      Mark as important
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pause className="h-4 w-4 mr-2" />
                      Snooze
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ListChecks className="h-4 w-4 mr-2" />
                      Add to tasks
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Volume2 className="h-4 w-4 mr-2" />
                      Mute
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Printer className="h-4 w-4 mr-2" />
                      Print all
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Sun className="h-4 w-4 mr-2" />
                      View in light theme
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Help and feedback
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Report spam
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Message Content */}
              <ScrollArea className="flex-1 p-6">
                <div className="max-w-3xl mx-auto">
                  <h1 className="text-2xl font-bold mb-4">{selectedMessage.subject}</h1>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b">
                    <div>
                      <p className="font-medium">{selectedMessage.from}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedMessage.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p>{selectedMessage.content}</p>
                  </div>
                </div>
              </ScrollArea>

              {/* Reply Actions */}
              <div className="border-t p-4 flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reply to {selectedMessage.from}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea placeholder="Type your reply..." rows={6} />
                      <Button className="w-full">Send Reply</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Forward className="h-4 w-4 mr-2" />
                      Forward
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Forward Message</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input placeholder="To:" />
                      <Textarea value={selectedMessage.content} rows={8} />
                      <Button className="w-full">Forward</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <Smile className="h-4 w-4 mr-2" />
                      Emoji
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2">
                    <div className="grid grid-cols-5 gap-2">
                      {emojis.map((emoji, i) => (
                        <Button
                          key={i}
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            toast.success(`Reacted with ${emoji}`);
                          }}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Mail className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p>Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose Dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>To</Label>
              <Input placeholder="recipient@example.com" />
            </div>
            <div>
              <Label>Subject</Label>
              <Input placeholder="Message subject" />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea placeholder="Type your message..." rows={10} />
            </div>
            <Button className="w-full" onClick={() => {
              toast.success("Message sent successfully!");
              setComposeOpen(false);
            }}>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Chat Dialog */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-4xl h-[600px]">
          <DialogHeader>
            <DialogTitle>Video Chat</DialogTitle>
          </DialogHeader>
          <div className="flex-1 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">Video chat will be available soon</p>
              <Button>Start Call</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Panel */}
      {chatOpen && (
        <div className="fixed bottom-0 right-4 w-80 h-96 bg-background border rounded-t-lg shadow-lg flex flex-col">
          <div className="p-3 border-b flex items-center justify-between">
            <h3 className="font-semibold">Messages</h3>
            <Button variant="ghost" size="icon" onClick={() => setChatOpen(false)}>
              ×
            </Button>
          </div>
          <ScrollArea className="flex-1 p-3">
            <p className="text-sm text-muted-foreground text-center">No new messages</p>
          </ScrollArea>
          <div className="p-3 border-t">
            <Input placeholder="Type a message..." />
          </div>
        </div>
      )}

      {/* Contacts Dialog */}
      <Dialog open={contactsOpen} onOpenChange={setContactsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contacts</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {contacts.map((contact) => (
                <Card key={contact.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{contact.name}</h3>
                        <Badge variant="outline" className="mb-2">{contact.type}</Badge>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {contact.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {contact.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button size="sm">Message</Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px]">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Notification Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Email Notifications</Label>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Desktop Notifications</Label>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Sound Alerts</Label>
                    <input type="checkbox" className="toggle" />
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Display Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Compact View</Label>
                    <input type="checkbox" className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Previews</Label>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div>
                    <Label>Messages Per Page</Label>
                    <Input type="number" defaultValue="50" className="mt-1" />
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Privacy Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Read Receipts</Label>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Online Status</Label>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                </div>
              </div>
              <Button className="w-full" onClick={() => {
                toast.success("Settings saved successfully!");
                setSettingsOpen(false);
              }}>
                Save Settings
              </Button>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Help & Feedback Dialog */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Help & Feedback</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Frequently Asked Questions</h3>
              <div className="space-y-2">
                <Card className="p-3">
                  <h4 className="font-medium mb-1">How do I report an animal?</h4>
                  <p className="text-sm text-muted-foreground">Navigate to the Report page and fill in the details with photos and location.</p>
                </Card>
                <Card className="p-3">
                  <h4 className="font-medium mb-1">How do I contact a shelter?</h4>
                  <p className="text-sm text-muted-foreground">Use the Messages feature to communicate directly with NGOs and shelters.</p>
                </Card>
                <Card className="p-3">
                  <h4 className="font-medium mb-1">Can I track my adoption application?</h4>
                  <p className="text-sm text-muted-foreground">Yes, check your messages for updates from the shelter.</p>
                </Card>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-3">Send Feedback</h3>
              <div className="space-y-3">
                <div>
                  <Label>Subject</Label>
                  <Input placeholder="Brief description..." />
                </div>
                <div>
                  <Label>Your Feedback</Label>
                  <Textarea placeholder="Tell us what you think..." rows={5} />
                </div>
                <Button className="w-full" onClick={() => {
                  toast.success("Thank you for your feedback!");
                  setHelpOpen(false);
                }}>
                  Submit Feedback
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Subscriptions Dialog */}
      <Dialog open={subscriptionsOpen} onOpenChange={setSubscriptionsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Subscriptions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Control which notifications and updates you receive from PawRescue.
            </p>
            {subscriptions.map((sub) => (
              <Card key={sub.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{sub.name}</h3>
                      {sub.enabled && <Badge variant="default">Active</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{sub.description}</p>
                  </div>
                  <input 
                    type="checkbox" 
                    defaultChecked={sub.enabled} 
                    className="toggle"
                    onChange={(e) => {
                      toast.success(e.target.checked ? `Subscribed to ${sub.name}` : `Unsubscribed from ${sub.name}`);
                    }}
                  />
                </div>
              </Card>
            ))}
            <Button className="w-full" onClick={() => {
              toast.success("Subscription preferences saved!");
              setSubscriptionsOpen(false);
            }}>
              Save Preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Messages;