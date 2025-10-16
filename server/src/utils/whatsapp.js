const generateWhatsAppMessage = (inquiry, album = null) => {
  const { customer_name, product_type, notes, phone_whatsapp } = inquiry;

  let message = `مرحبًا ${customer_name} 👋\n\n`;
  message += `شكراً لتواصلك معنا عبر موقع ساندي مكرمية.\n\n`;
  message += `طلبك: ${product_type === "macrame" ? "مكرمية" : "برواز"}`;

  if (album) {
    message += ` - ${album.title}`;
  }

  message += `\n\n`;

  if (notes) {
    message += `ملاحظاتك: ${notes}\n\n`;
  }

  message += `نحن نعمل على طلبك وسنرد عليك قريباً.\n\n`;
  message += `مع تحياتي،\nساندي مكرمية 🌷`;

  return message;
};

const generateWhatsAppLink = (phoneNumber, message) => {
  const cleanPhone = phoneNumber
    .replace(/\s+/g, "") 
    .replace(/[\-\(\)\+]/g, "") 
    .replace(/^00/, ""); 
  
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

const createInquiryWhatsAppLink = async (inquiry, album = null) => {
  const message = generateWhatsAppMessage(inquiry, album);

  const customerPhone = inquiry.phone_whatsapp;

  if (!customerPhone) {
    throw new Error("Customer phone number not found");
  }

  return generateWhatsAppLink(customerPhone, message);
};

const createOwnerWhatsAppLink = async (inquiry, album = null) => {
  const { customer_name, product_type, notes } = inquiry;

  let message = `مرحباً ساندي 👋\n\n`;
  message += `أنا: ${customer_name}\n`;
  message += `أود طلب: ${product_type === "macrame" ? "مكرمية" : "برواز"}`;

  if (album) {
    message += ` - ${album.title}`;
  }

  message += `\n\n`;

  if (notes) {
    message += `ملاحظات: ${notes}\n\n`;
  }

  message += `شكراً 🌷`;

  const whatsappOwner = process.env.WHATSAPP_OWNER;

  if (!whatsappOwner) {
    throw new Error("WhatsApp owner number not configured");
  }

  return generateWhatsAppLink(whatsappOwner, message);
};

export {
  generateWhatsAppMessage,
  generateWhatsAppLink,
  createInquiryWhatsAppLink,
  createOwnerWhatsAppLink,
};
