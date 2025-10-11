import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Image,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Mail,
} from "lucide-react";
import useAuthStore from "../../api/useAuthStore";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const menuItems = [
    {
      path: "/admin",
      icon: <LayoutDashboard size={20} />,
      label: "لوحة التحكم",
    },
    {
      path: "/admin/home",
      icon: <Home size={20} />,
      label: "الصفحة الرئيسية",
    },
    {
      path: "/admin/albums",
      icon: <Image size={20} />,
      label: "الألبومات",
    },
    {
      path: "/admin/testimonials",
      icon: <MessageSquare size={20} />,
      label: "التقييمات",
    },
    {
      path: "/admin/inquiries",
      icon: <Mail size={20} />,
      label: "الطلبات والاستفسارات",
    },
    {
      path: "/admin/faq",
      icon: <HelpCircle size={20} />,
      label: "الأسئلة الشائعة",
    },
    {
      path: "/admin/about-page",
      icon: <FileText size={20} />,
      label: "صفحة من نحن",
    },
    {
      path: "/admin/contact-messages",
      icon: <Mail size={20} />,
      label: "رسائل التواصل",
    },
    {
      path: "/admin/settings",
      icon: <Settings size={20} />,
      label: "الإعدادات العامة",
    },
  ];

  return (
    <div className="h-screen bg-gray-100 flex" dir="rtl">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        } md:w-64`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-3 ${
                sidebarOpen ? "block" : "hidden"
              } md:flex`}
            >
              <img
                src="/logo.jpg"
                alt="Sandy Macrame"
                className="h-10 w-10 rounded-full"
                loading="lazy"
              />
              <h2 className="font-bold text-purple">لوحة التحكم</h2>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <nav className="mt-4 flex-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-gray-700 hover:bg-purple hover:text-white transition-colors ${
                  isActive ? "bg-purple text-white border-r-4 border-pink" : ""
                }`
              }
            >
              {item.icon}
              <span
                className={`mr-3 ${sidebarOpen ? "block" : "hidden"} md:block`}
              >
                {item.label}
              </span>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span
              className={`mr-3 ${sidebarOpen ? "block" : "hidden"} md:block`}
            >
              تسجيل الخروج
            </span>
          </button>
        </nav>

        <div className=""></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
