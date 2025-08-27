
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Losungsorientierung from "./pages/Losungsorientierung";
import Mindset from "./pages/Mindset";
import Konfliktloesung from "./pages/Konfliktloesung";
import Streitschlichter from "./pages/Streitschlichter";
import SagsMalAnders from "./pages/SagsMalAnders";
import IchBotschaften from "./pages/IchBotschaften";
import Denkweiser from "./pages/Denkweiser";
import Erzaehlzauber from "./pages/Erzaehlzauber";
import Wortentdecker from "./pages/Wortentdecker";
import SolutionStory from "./pages/SolutionStory";
import SumUp from "./pages/SumUp";
import PaareFinden from "./pages/PaareFinden";
import Mindshift from "./pages/Mindshift";
import Mindmatch from "./pages/Mindmatch";
import Gefuehlsradar from "./pages/Gefuehlsradar";
import Profile from "./pages/Profile";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/loesungsorientierung" element={<Losungsorientierung />} />
          <Route path="/mindset" element={<Mindset />} />
          <Route path="/konfliktloesung" element={<Konfliktloesung />} />
          <Route path="/streitschlichter" element={<Streitschlichter />} />
          <Route path="/sags-mal-anders" element={<SagsMalAnders />} />
          <Route path="/ich-botschaften" element={<IchBotschaften />} />
          <Route path="/denkweiser" element={<Denkweiser />} />
          <Route path="/erzaehlzauber" element={<Erzaehlzauber />} />
          <Route path="/wortentdecker" element={<Wortentdecker />} />
          <Route path="/solutionstory" element={<SolutionStory />} />
          <Route path="/sumup" element={<SumUp />} />
          <Route path="/paare-finden" element={<PaareFinden />} />
          <Route path="/mindshift" element={<Mindshift />} />
          <Route path="/mindmatch" element={<Mindmatch />} />
          <Route path="/gefuehlsradar" element={<Gefuehlsradar />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
