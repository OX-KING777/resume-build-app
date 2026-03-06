export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function isValidUrl(url: string): boolean {
  if (!url) return true; // optional field
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidPhone(phone: string): boolean {
  if (!phone) return true; // optional field
  return /^[\d\s\-+()]+$/.test(phone);
}
