// lib/shared/cookie-utils.ts - Complete version with setCookieValue
import type { PreferencesMap } from './preferences-types';
import { DEFAULT_PREFERENCES } from './preferences-types';

export function parseCookies(cookieHeader: string): Record<string, string> {
  if (!cookieHeader) return {};
  
  return cookieHeader.split(';').reduce((cookies, cookie) => {
    const trimmed = cookie.trim();
    const equalIndex = trimmed.indexOf('=');
    if (equalIndex > 0) {
      const name = trimmed.substring(0, equalIndex);
      const value = trimmed.substring(equalIndex + 1);
      cookies[name] = value;
    }
    return cookies;
  }, {} as Record<string, string>);
}

export function getPreferencesFromCookieString(cookieString: string): PreferencesMap {
  const cookies = parseCookies(cookieString);
  let allPrefs: PreferencesMap = { ...DEFAULT_PREFERENCES };

  if (cookies.sitePreferences) {
    try {
      const parsedPrefs = JSON.parse(decodeURIComponent(cookies.sitePreferences));
      allPrefs = {
        ...allPrefs,
        ...parsedPrefs,
      };
    } catch (error) {
      console.error('Failed to parse preferences cookie:', error);
    }
  }

  return allPrefs;
}

// Universal function that works on both server and client
export function getCurrentPreferences(): PreferencesMap {
  // Server-side: no document.cookie available
  if (typeof document === 'undefined') {
    return { ...DEFAULT_PREFERENCES };
  }
  
  // Client-side: read from document.cookie
  return getPreferencesFromCookieString(document.cookie);
}

// MISSING FUNCTION - Add this to your cookie-utils.ts:
export function setCookieValue(name: string, value: string, days: number = 365): void {
  if (typeof document === 'undefined') return;
  
  try {
    const encodedValue = encodeURIComponent(value);
    
    if (encodedValue.length > 4000) {
      console.error('Cookie value too long:', encodedValue.length);
      return;
    }

    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    const cookieString = `${name}=${encodedValue}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    document.cookie = cookieString;
    
    // Verify it was set
    const verification = parseCookies(document.cookie)[name];
    if (!verification) {
      console.error('Cookie verification failed for:', name);
      // Fallback to localStorage for development if cookies fail
      if (process.env.NODE_ENV === 'development') {
        try {
          localStorage.setItem(`cookie_${name}`, value);
          console.log('Saved to localStorage as fallback');
        } catch (e) {
          console.error('localStorage also failed:', e);
        }
      }
    }
  } catch (error) {
    console.error('Failed to set cookie:', error);
  }
}
