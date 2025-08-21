import type {PreferencesMap} from '../shared/preferences-types';
import {DEFAULT_PREFERENCES} from '../shared/preferences-types';

export function parseCookies(cookieHeader: string): Record<string, string> {
  //console.log('parseCookies - Input header:', cookieHeader);

  const result = cookieHeader.split(';').reduce(
    (cookies, cookie) => {
      const trimmed = cookie.trim();
      //console.log('parseCookies - Processing cookie part:', trimmed);

      const equalIndex = trimmed.indexOf('=');
      if (equalIndex > 0) {
        const name = trimmed.substring(0, equalIndex);
        const value = trimmed.substring(equalIndex + 1);
        cookies[name] = value;
        //console.log(`parseCookies - Found cookie: ${name} = ${value}`);
      } else {
        //console.log('parseCookies - Skipping malformed cookie:', trimmed);
      }
      return cookies;
    },
    {} as Record<string, string>,
  );

  //console.log('parseCookies - Final result:', result);
  return result;
}

export function getPreferencesFromRequest(request: Request): PreferencesMap {
  const cookieHeader = request.headers.get('cookie') || '';
  //console.log('Server - Raw cookie header:', cookieHeader);

  const cookies = parseCookies(cookieHeader);
  //console.log('Server - Parsed cookies:', cookies);

  let allPrefs: PreferencesMap = {...DEFAULT_PREFERENCES};

  if (cookies.sitePreferences) {
    try {
      //console.log('Server - Raw cookie value:', cookies.sitePreferences);
      //console.log('Server - Attempting to decode:', decodeURIComponent(cookies.sitePreferences));

      const parsedPrefs = JSON.parse(
        decodeURIComponent(cookies.sitePreferences),
      );
      //console.log('Server - Parsed preferences from cookie:', parsedPrefs);
      allPrefs = {
        ...allPrefs,
        ...parsedPrefs,
      };
    } catch (error) {
      console.error('Failed to parse server cookie:', error);
      //console.log('Server - Using defaults due to parse error');
    }
  } else {
    console.log('Server - No sitePreferences cookie found, using defaults');
  }

  //console.log('Server - Final preferences:', allPrefs);
  return allPrefs;
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
      console.error('Failed to parse server cookie:', error);
    }
  }

  return allPrefs;
}

// Helper to get specific preference type
export function getPreference<K extends keyof PreferencesMap>(
  cookieHeader: string,
  key: K,
): PreferencesMap[K] {
  const allPrefs = getPreferencesFromCookieString(cookieHeader);
  return allPrefs[key] || DEFAULT_PREFERENCES[key];
}

// For use in GraphQL context (updated for Yoga)
export function createPreferencesContext(request: Request) {
  const preferences = getPreferencesFromRequest(request);

  return {
    preferences,
    getPreference<K extends keyof PreferencesMap>(key: K): PreferencesMap[K] {
      return preferences[key] || DEFAULT_PREFERENCES[key];
    },
  };
}

// Helper for Yoga context integration
export function createContextWithPreferences(yogaContext: any) {
  const request = yogaContext.request;
  const preferences = request ? getPreferencesFromRequest(request) : {};

  return {
    ...yogaContext,
    preferences,
    getPreference<K extends keyof PreferencesMap>(key: K): PreferencesMap[K] {
      return preferences[key] || DEFAULT_PREFERENCES[key];
    },
  };
}
