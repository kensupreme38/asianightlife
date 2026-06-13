export const WHATSAPP_PHONE = "6582668669";
export const WHATSAPP_DISPLAY = "+65 8266 8669";
export const WHATSAPP_URL =
  "https://api.whatsapp.com/send/?phone=6582668669&text&type=phone_number&app_absent=0";
export const TELEGRAM_URL = "https://t.me/asianightlifeanl";
export const TELEGRAM_HANDLE = "@asianightlifeanl";
export const SITE_URL = "https://asianightlife.sg";

export function whatsappMessageUrl(message: string): string {
  return `https://api.whatsapp.com/send/?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
}

export function telegramMessageUrl(message: string): string {
  return `https://t.me/asianightlifeanl?text=${encodeURIComponent(message)}`;
}
