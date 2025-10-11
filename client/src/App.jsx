import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { SettingsProvider } from "./context/SettingsContext";
const Home = lazy(() => import("./pages/Home"));
const Gallery = lazy(() => import("./pages/Gallery"));
const About = lazy(() => import("./pages/About"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const AlbumDetail = lazy(() => import("./pages/AlbumDetail"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminSetup = lazy(() => import("./pages/admin/Setup"));
const EmailVerification = lazy(() => import("./pages/admin/EmailVerification"));
const AdminHomeSettings = lazy(() => import("./pages/admin/AdminHomeSettings"));
const AlbumsAdmin = lazy(() => import("./pages/admin/AlbumsAdmin"));
const TestimonialsAdmin = lazy(() => import("./pages/admin/TestimonialsAdmin"));
const InquiriesAdmin = lazy(() => import("./pages/admin/InquiriesAdmin"));
const GeneralSettings = lazy(() => import("./pages/admin/GeneralSettings"));
const ContactMessagesAdmin = lazy(() =>
  import("./pages/admin/ContactMessagesAdmin")
);
const MediaAdmin = lazy(() => import("./pages/admin/MediaAdmin"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AboutPageSettings = lazy(() => import("./pages/admin/AboutPageSettings"));

import "./App.css";
import OrderForm from "./forms/OrderForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";
import Loading from "./utils/Loading";
import ErrorBoundary from "./components/ErrorBoundary";
import { HelmetProvider } from "react-helmet-async";

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
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <SettingsProvider>
              <ScrollToTop />
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/testimonials" element={<Testimonials />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/album/:slug" element={<AlbumDetail />} />
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
                    <Route
                      path="testimonials"
                      element={<TestimonialsAdmin />}
                    />
                    <Route path="inquiries" element={<InquiriesAdmin />} />
                    <Route
                      path="contact-messages"
                      element={<ContactMessagesAdmin />}
                    />
                    <Route path="settings" element={<GeneralSettings />} />
                    <Route path="about-page" element={<AboutPageSettings />} />
                  </Route>

                  {/* 404 Page */}
                  <Route
                    path="*"
                    element={
                      <Layout>
                        <div className="min-h-screen bg-beige flex items-center justify-center">
                          <div className="text-center">
                            <h1 className="text-6xl font-bold text-purple mb-4">
                              404
                            </h1>
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
              </Suspense>
            </SettingsProvider>
            <OrderForm />

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
      </HelmetProvider>
    </ErrorBoundary>
  );
}
