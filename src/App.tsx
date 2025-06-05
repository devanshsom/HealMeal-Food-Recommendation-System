
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import ProfilePage from "./pages/ProfilePage";
import MealsPage from "./pages/MealsPage";
import TrackerPage from "./pages/TrackerPage";
import NotFound from "./pages/NotFound";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import AuthPage from "./pages/AuthPage";
import PaymentPage from "./pages/PaymentPage";
import DeliveryTrackingPage from "./pages/DeliveryTrackingPage";
import ProtectedRoute from "./components/ProtectedRoute";

import { UserProvider } from "./context/UserContext";
import { MealLogProvider } from "./context/MealLogContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <UserProvider>
          <MealLogProvider>
            <CartProvider>
              <BrowserRouter>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Index />} />
                    <Route element={<ProtectedRoute />}>
                      <Route path="profile" element={<ProfilePage />} />
                      <Route path="meals" element={<MealsPage />} />
                      <Route path="tracker" element={<TrackerPage />} />
                      <Route path="cart" element={<CartPage />} />
                      <Route path="orders" element={<OrdersPage />} />
                      <Route path="payment" element={<PaymentPage />} />
                      <Route path="delivery-tracking" element={<DeliveryTrackingPage />} />
                    </Route>
                    <Route path="privacy" element={<PrivacyPage />} />
                    <Route path="terms" element={<TermsPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </CartProvider>
          </MealLogProvider>
        </UserProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
