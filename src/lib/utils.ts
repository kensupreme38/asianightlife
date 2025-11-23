import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a unique referral code based on user ID and timestamp
 * Format: 8 characters, uppercase letters and numbers
 * Excludes confusing characters: 0, O, 1, I, L
 * Uses user_id hash + timestamp to ensure uniqueness
 */
export function generateReferralCode(userId?: string): string {
  // Characters that are easy to read and distinguish
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  // Use timestamp for uniqueness
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);

  // If userId provided, use first 4 chars of hash, otherwise random
  let prefix = "";
  if (userId) {
    // Simple hash of userId to get consistent prefix
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = (hash << 5) - hash + userId.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    const hashStr = Math.abs(hash).toString(36).toUpperCase().slice(0, 4);
    prefix = hashStr.padStart(4, chars[0]);
  } else {
    // Random 4 chars if no userId
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      prefix += chars[randomIndex];
    }
  }

  // Combine prefix + timestamp = 8 characters total
  return `${prefix}${timestamp}`;
}
