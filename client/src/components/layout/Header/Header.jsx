import { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../common/Logo/Logo";
import ApplyNow from "../../ApplyNow";
import { Menu, X, ChevronDown } from "lucide-react";

const navigationItems = [
  { title: "الرئيسية", path: "/" },
  { title: "المعرض", path: "/gallery" },
  { title: "من نحن", path: "/about" },
  { title: "آراء العملاء", path: "/testimonials" },
  {
    title: "المساعدة",
    children: [
      { title: "اتصل بنا", path: "/contact" },
      { title: "الأسئلة الشائعة", path: "/faq" },
    ],
  },
];

export default function Header() {
  const [isMenuMobileOpen, setIsMenuMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const handleToggleMenu = () => {
    setIsMenuMobileOpen(!isMenuMobileOpen);
  };

  const handleDropdownToggle = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const closeMenu = () => {
    setIsMenuMobileOpen(false);
    setDropdownOpen(null);
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50" dir="rtl">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Logo />
          <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
            {navigationItems.map((item, index) => (
              <div key={index} className="relative group">
                {item.children ? (
                  <div>
                    <button
                      className="flex mr-6 items-center gap-1 text-gray-600 hover:text-purple transition-colors py-2 cursor-pointer"
                      onMouseEnter={() => setDropdownOpen(index)}
                      onMouseLeave={() => setDropdownOpen(null)}
                    >
                      {item.title}
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          dropdownOpen === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* القائمة المنسدلة */}
                    <div
                      className={`absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border overflow-hidden transition-all duration-200 ${
                        dropdownOpen === index
                          ? "opacity-100 visible transform translate-y-0"
                          : "opacity-0 invisible transform -translate-y-2"
                      }`}
                      onMouseEnter={() => setDropdownOpen(index)}
                      onMouseLeave={() => setDropdownOpen(null)}
                    >
                      {item.children.map((child, childIndex) => (
                        <NavLink
                          key={childIndex}
                          to={child.path}
                          className="block px-4 py-3 text-gray-600 hover:text-white hover:bg-purple hover:bg-opacity-5 transition-colors border-b border-gray-100 last:border-b-0"
                          onClick={closeMenu}
                        >
                          {child.title}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ) : (
                  // عنصر عادي
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `text-gray-600 hover:text-purple transition-colors py-2 ${
                        isActive
                          ? "text-purple font-semibold border-b-2 border-purple"
                          : ""
                      }`
                    }
                  >
                    {item.title}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>

          {/* زر الطلب */}
          <div className="hidden md:block">
            <ApplyNow />
          </div>

          {/* زر القائمة للموبايل */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-purple transition-colors"
            onClick={handleToggleMenu}
            aria-label="فتح القائمة"
          >
            {isMenuMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* القائمة المنسدلة للموبايل */}
        {isMenuMobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <nav className="px-4 py-4 space-y-2">
              {navigationItems.map((item, index) => (
                <div key={index}>
                  {item.children ? (
                    // عنصر مع قائمة فرعية
                    <div>
                      <button
                        className="flex items-center justify-between w-full text-gray-600 hover:text-purple transition-colors py-2 text-right"
                        onClick={() => handleDropdownToggle(index)}
                      >
                        {item.title}
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            dropdownOpen === index ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* القائمة الفرعية للموبايل */}
                      {dropdownOpen === index && (
                        <div className="pr-4 mt-2 space-y-2">
                          {item.children.map((child, childIndex) => (
                            <NavLink
                              key={childIndex}
                              to={child.path}
                              className="block text-gray-600 hover:text-purple transition-colors py-2 border-r-2 border-gray-200 pr-3"
                              onClick={closeMenu}
                            >
                              {child.title}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // عنصر عادي
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `block text-gray-600 hover:text-purple transition-colors py-2 ${
                          isActive ? "text-purple font-semibold" : ""
                        }`
                      }
                      onClick={closeMenu}
                    >
                      {item.title}
                    </NavLink>
                  )}
                </div>
              ))}

              {/* زر الطلب في القائمة المحمولة */}
              <div className="pt-4 border-t border-gray-200 mt-4">
                <ApplyNow />
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
