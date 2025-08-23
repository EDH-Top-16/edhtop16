import type {PreferencesMap} from './preferences-types';
import {DEFAULT_PREFERENCES} from './preferences-types';

export function parseCookies(cookieHeader: string): Record<string, string> {
  if (!cookieHeader) return {};

  return cookieHeader.split(';').reduce(
    (cookies, cookie) => {
      const trimmed = cookie.trim();
      const equalIndex = trimmed.indexOf('=');
      if (equalIndex > 0) {
        const name = trimmed.substring(0, equalIndex);
        const value = trimmed.substring(equalIndex + 1);
        cookies[name] = value;
      }
      return cookies;
    },
    {} as Record<string, string>,
  );
}

export function getPreferencesFromCookieString(
  cookieString: string,
): PreferencesMap {
  const cookies = parseCookies(cookieString);
  let allPrefs: PreferencesMap = {...DEFAULT_PREFERENCES};

  if (cookies.sitePreferences) {
    try {
      const parsedPrefs = JSON.parse(
        decodeURIComponent(cookies.sitePreferences),
      );
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

export function getCurrentPreferences(): PreferencesMap {
  if (typeof document === 'undefined') {
    return {...DEFAULT_PREFERENCES};
  }

  return getPreferencesFromCookieString(document.cookie);
}

export function setCookieValue(
  name: string,
  value: string,
  days: number = 365,
): void {
  if (typeof document === 'undefined') return;

  try {
    const encodedValue = encodeURIComponent(value);

    if (encodedValue.length > 4000) {
      console.error('Cookie value too long:', encodedValue.length);
      return;
    }

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    const cookieString = `${name}=${encodedValue}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    document.cookie = cookieString;

    const verification = parseCookies(document.cookie)[name];
    if (!verification) {
      console.error('Cookie verification failed for:', name);

      if (process.env.NODE_ENV === 'development') {
        try {
          localStorage.setItem(`cookie_${name}`, value);
        } catch (e) {
          console.error('localStorage also failed:', e);
        }
      }
    }
  } catch (error) {
    console.error('Failed to set cookie:', error);
  }
}
