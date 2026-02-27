import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Templates from "./pages/Templates";
import Preview from "./pages/Preview";
import CaseStudy from "./pages/CaseStudy";
import NotFound from "./pages/NotFound";
import PerformancePanel from "./components/PerformancePanel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/preview/:templateId" element={<Preview />} />
          <Route path="/case-study" element={<CaseStudy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <PerformancePanel />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;