/**
 * Centralized Contact & WhatsApp configuration.
 * Reads from process.env.NEXT_PUBLIC_WHATSAPP_NUMBER or process.env.NEXT_PUBLIC_CONTACT_PHONE.
 * Fallback default: '2348105281572'
 */

const rawPhone =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
  process.env.NEXT_PUBLIC_CONTACT_PHONE ||
  '2348105281572';

export const WHATSAPP_NUMBER = rawPhone.replace(/[^0-9]/g, '');

export const DISPLAY_PHONE = rawPhone.startsWith('+')
  ? rawPhone
  : `+${WHATSAPP_NUMBER}`;

export const getWhatsAppLink = (message?: string): string => {
  const encodedMsg = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${WHATSAPP_NUMBER}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
};
