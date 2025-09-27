const generateWhatsAppMessage = (inquiry, album = null) => {
  const { customer_name, product_type, notes, phone_whatsapp } = inquiry;

  let message = `مرحبًا ساندي 👋\n\n`;
  message += `أنا: ${customer_name}\n`;
  message += `أود طلب: ${product_type === "macrame" ? "مكرمية" : "برواز"}`;

  if (album) {
    message += ` - ${album.title}`;
  }

  message += `\n`;

  if (notes) {
    message += `ملاحظات: ${notes}\n`;
  }

  message += `رقمي على واتساب: ${phone_whatsapp}\n\n`;
  message += `شكراً 🌷`;

  return message;
};

const generateWhatsAppLink = (phoneNumber, message) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

const createInquiryWhatsAppLink = async (inquiry, album = null) => {
  const message = generateWhatsAppMessage(inquiry, album);
  const whatsappOwner = process.env.WHATSAPP_OWNER;

  if (!whatsappOwner) {
    throw new Error("WhatsApp owner number not configured");
  }

  return generateWhatsAppLink(whatsappOwner, message);
};

// تصحيح exports
export {
  generateWhatsAppMessage,
  generateWhatsAppLink,
  createInquiryWhatsAppLink,
};
