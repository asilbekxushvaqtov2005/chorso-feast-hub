import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./components/layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import MenuManagement from "./pages/admin/MenuManagement";
import Couriers from "./pages/admin/Couriers";
import Orders from "./pages/admin/Orders";
import KitchenView from "./pages/admin/KitchenView";
import { AdminProvider } from "./context/AdminContext";
import { OrderProvider } from "./context/OrderContext";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";
import CustomerLogin from "./pages/auth/Login";
import CustomerVerify from "./pages/auth/Verify";
import Profile from "./pages/auth/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminProvider>
      <OrderProvider>
        <CustomerAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<CustomerLogin />} />
                <Route path="/verify" element={<CustomerVerify />} />
                <Route path="/profile" element={<Profile />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="menu" element={<MenuManagement />} />
                  <Route path="couriers" element={<Couriers />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="kitchen/main" element={<KitchenView station="main" title="Oshpaz Ekrani" />} />
                  <Route path="kitchen/samsa" element={<KitchenView station="samsa" title="Somsapaz Ekrani" />} />
                  <Route path="kitchen/shashlik" element={<KitchenView station="shashlik" title="Shashlikchi Ekrani" />} />
                </Route>

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CustomerAuthProvider>
      </OrderProvider>
    </AdminProvider>
  </QueryClientProvider>
);

export default App;
