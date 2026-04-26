import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import AtletaView from "./pages/sistema/AtletaView.tsx";
import DMView from "./pages/sistema/DMView.tsx";
import GestaoView from "./pages/sistema/GestaoView.tsx";
import EconoView from "./pages/sistema/EconoView.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sistema/atleta" element={<AtletaView />} />
        <Route path="/sistema/dm" element={<DMView />} />
        <Route path="/sistema/gestao" element={<GestaoView />} />
        <Route path="/sistema/econo" element={<EconoView />} />
        <Route path="/atleta" element={<Navigate to="/sistema/atleta" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
