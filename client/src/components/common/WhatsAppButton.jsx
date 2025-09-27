import { MessageCircle } from "lucide-react";

export default function WhatsAppButton({
  phoneNumber,
  message = "",
  customerName = "",
  inquiryId = null,
  className = "",
  children = "تواصل عبر واتساب",
}) {
  const handleClick = () => {
    let whatsappMessage = message;

    if (!message && customerName) {
      whatsappMessage = `مرحباً ${customerName}،\n\nشكراً لك لتواصلك معنا عبر موقع ساندي مكرمية.\n${
        inquiryId ? `رقم الطلب: ${inquiryId}\n` : ""
      }\nنحن نعمل على طلبك وسنرد عليك قريباً.\n\nمع تحياتي،\nساندي مكرمية`;
    } else if (!message) {
      whatsappMessage = "مرحباً ساندي، أود التواصل معك بخصوص منتجاتكم الرائعة";
    }

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className={`bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center justify-center gap-2 cursor-pointer ${className}`}
    >
      <MessageCircle size={16} />
      {children}
    </button>
  );
}
