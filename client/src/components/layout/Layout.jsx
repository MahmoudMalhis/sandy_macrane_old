// src/components/layout/Layout.jsx
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-beige">
      <Header />
      <main><Outlet /></main>
      <Footer />
    </div>
  );
}
