import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppSidebar from "@/components/AppSidebar";
import Dashboard from "@/pages/Dashboard";
import FirePlanner from "@/pages/FirePlanner";
import MoneyHealth from "@/pages/MoneyHealth";
import TaxAI from "@/pages/TaxAI";
import LifeEvents from "@/pages/LifeEvents";
import GoalTracker from "@/pages/GoalTracker";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen">
          <AppSidebar />
          <main className="flex-1 ml-64 p-6 lg:p-8 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/fire" element={<FirePlanner />} />
              <Route path="/health" element={<MoneyHealth />} />
              <Route path="/tax" element={<TaxAI />} />
              <Route path="/life-events" element={<LifeEvents />} />
              <Route path="/goals" element={<GoalTracker />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
