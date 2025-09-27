import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import AlbumDetail from "./pages/AlbumDetail";
import "./App.css";
import OrderForm from "./forms/OrderForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import { Toaster } from "react-hot-toast";
import AdminSetup from "./pages/admin/Setup";
import EmailVerification from "./pages/admin/EmailVerification";
import AdminHomeSettings from "./pages/admin/AdminHomeSettings";
import AlbumsAdmin from "./pages/admin/AlbumsAdmin";
import TestimonialsAdmin from "./pages/admin/TestimonialsAdmin";
import InquiriesAdmin from "./pages/admin/InquiriesAdmin";
import GeneralSettings from "./pages/admin/GeneralSettings";
import MediaAdmin from "./pages/admin/MediaAdmin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/album/:slug" element={<AlbumDetail />} />
            <Route path="/order" element={<OrderForm />} />
          </Route>
          {/* Admin Routes */}
          <Route path="/admin/setup" element={<AdminSetup />} />
          <Route
            path="/admin/verify-email/:token"
            element={<EmailVerification />}
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="home" element={<AdminHomeSettings />} />
            <Route path="albums" element={<AlbumsAdmin />} />
            <Route path="albums/:id/media" element={<MediaAdmin />} />
            <Route path="testimonials" element={<TestimonialsAdmin />} />
            <Route path="inquiries" element={<InquiriesAdmin />} />
            <Route path="settings" element={<GeneralSettings />} />
          </Route>

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <Layout>
                <div className="min-h-screen bg-beige flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-purple mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                      الصفحة غير موجودة
                    </h2>
                    <p className="text-gray-600 mb-8">
                      عذراً، الصفحة التي تبحث عنها غير موجودة
                    </p>
                    <button
                      onClick={() => (window.location.href = "/")}
                      className="bg-purple text-white px-6 py-3 rounded-lg hover:bg-purple-hover transition-colors"
                    >
                      العودة للرئيسية
                    </button>
                  </div>
                </div>
              </Layout>
            }
          />
        </Routes>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: "Cairo",
              direction: "rtl",
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
