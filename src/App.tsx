import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import ReportAnimal from "./pages/ReportAnimal";
import AdoptionListings from "./pages/AdoptionListings";
import AnimalProfile from "./pages/AnimalProfile";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NGODashboard from "./pages/NGODashboard";
import FavoritesPage from "./pages/FavoritesPage";
import EmailMessages from "./pages/EmailMessages";
import LiveMap from "./pages/LiveMap";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "next-themes";
import HoverReceiver from "@/visual-edits/VisualEditsMessenger";

// Import fonts
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HoverReceiver />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <BrowserRouter>
          <div className="min-h-screen bg-background font-inter">
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/report" element={<ReportAnimal />} />
              <Route path="/adopt" element={<AdoptionListings />} />
              <Route path="/animal/:id" element={<AnimalProfile />} />
              <Route path="/live-map" element={<LiveMap />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/ngo-dashboard" element={<NGODashboard />} />
              <Route path="/auth" element={<AuthPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;