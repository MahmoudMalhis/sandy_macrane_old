export const cleanPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  return String(phoneNumber).replace(/[^\d]/g, '');
};

export const generateWhatsAppLink = (phoneNumber, message = '') => {
  const cleanNumber = cleanPhoneNumber(phoneNumber);
  
  if (!cleanNumber) {
    throw new Error('رقم الواتساب غير صحيح');
  }
  
  const encodedMessage = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${cleanNumber}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
};

export const openWhatsApp = (phoneNumber, message = '') => {
  try {
    const link = generateWhatsAppLink(phoneNumber, message);
    window.open(link, '_blank');
  } catch (error) {
    console.error('خطأ في فتح واتساب:', error);
    alert('عذراً، رقم الواتساب غير متوفر حالياً');
  }
};