import {useState, useEffect, useRef, useCallback} from 'react';
import {updateRelayPreferences} from './relay_client_environment';

export interface CommandersPreferences {
  sortBy?: 'CONVERSION' | 'POPULARITY';
  timePeriod?:
    | 'ONE_MONTH'
    | 'THREE_MONTHS'
    | 'SIX_MONTHS'
    | 'ONE_YEAR'
    | 'ALL_TIME'
    | 'POST_BAN';
  colorId?: string;
  minEntries?: number;
  minTournamentSize?: number;
  display?: 'card' | 'table';
}

export interface EntryPreferences {
  maxStanding?: number | null;
  minEventSize?: number | null;
  sortBy?: 'TOP' | 'NEW';
  timePeriod?:
    | 'ONE_MONTH'
    | 'THREE_MONTHS'
    | 'SIX_MONTHS'
    | 'ONE_YEAR'
    | 'ALL_TIME'
    | 'POST_BAN';
}

export interface TournamentPreferences {
  tab?: 'entries' | 'breakdown' | 'commander';
  commander?: string | null;
}

export interface TournamentsPreferences {
  sortBy?: 'PLAYERS' | 'DATE';
  timePeriod?:
    | 'ONE_MONTH'
    | 'THREE_MONTHS'
    | 'SIX_MONTHS'
    | 'ONE_YEAR'
    | 'ALL_TIME'
    | 'POST_BAN';
  minSize?: number;
}

export type PreferencesMap = {
  commanders?: CommandersPreferences;
  entry?: EntryPreferences;
  tournament?: TournamentPreferences;
  tournaments?: TournamentsPreferences;
};

export const DEFAULT_PREFERENCES: PreferencesMap = {
  commanders: {
    sortBy: 'CONVERSION',
    timePeriod: 'ONE_MONTH',
    display: 'card',
    minEntries: 0,
    minTournamentSize: 0,
    colorId: '',
  },
  entry: {
    maxStanding: null,
    minEventSize: null,
    sortBy: 'TOP',
    timePeriod: 'ONE_YEAR',
  },
  tournament: {
    tab: 'entries',
    commander: null,
  },
  tournaments: {
    sortBy: 'DATE',
    timePeriod: 'ALL_TIME',
    minSize: 0,
  },
};

let refetchCallback: ((prefs?: any) => void) | undefined = undefined;

export function setRefetchCallback(callback?: (prefs?: any) => void) {
  refetchCallback = callback;
}

export function clearRefetchCallback() {
  refetchCallback = undefined;
}

function getCookie(name: string): string | null {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
  } catch (error) {
    console.error('Failed to get cookie:', error);
  }
  return null;
}

function setCookie(name: string, value: string, days: number = 365) {
  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
  } catch (error) {
    console.error('Failed to set cookie:', error);
  }
}

export function usePreferences<K extends keyof PreferencesMap>(
  key: K,
  defaultPrefs: PreferencesMap[K],
) {
  const [preferences, setPreferences] =
    useState<PreferencesMap[K]>(defaultPrefs);
  const [isHydrated, setIsHydrated] = useState(false);
  const refetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasHydratedRef = useRef(false);

  useEffect(() => {
    if (hasHydratedRef.current) return;
    hasHydratedRef.current = true;

    setIsHydrated(true);

    let allPrefs: PreferencesMap = {...DEFAULT_PREFERENCES};
    const cookieValue = getCookie('sitePreferences');
    if (cookieValue) {
      try {
        allPrefs = {
          ...allPrefs,
          ...JSON.parse(decodeURIComponent(cookieValue)),
        };
      } catch (error) {
        console.error('Failed to parse cookie:', error);
      }
    }
    const serverPrefs = allPrefs[key] || defaultPrefs;

    if (JSON.stringify(preferences) !== JSON.stringify(serverPrefs)) {
      setPreferences(serverPrefs);
      updateRelayPreferences({[key]: serverPrefs}); // <-- wrap in object with key
      setTimeout(() => {
        refetchCallback?.(serverPrefs);
      }, 100);
    } else {
      updateRelayPreferences({[key]: serverPrefs}); // <-- wrap in object with key
    }
  }, [preferences, key, defaultPrefs]);

  const updatePreference = useCallback(
    (prefKey: keyof PreferencesMap[K], value: any) => {
      setPreferences((prevPrefs) => {
        const newPrefs = {...(prevPrefs ?? {})} as PreferencesMap[K];
        if (!value && value !== 0) {
          delete (newPrefs as any)[prefKey];
        } else {
          (newPrefs as any)[prefKey] = value;
        }

        let allPrefs: PreferencesMap = {...DEFAULT_PREFERENCES};
        const cookieValue = getCookie('sitePreferences');
        if (cookieValue) {
          try {
            allPrefs = {
              ...allPrefs,
              ...JSON.parse(decodeURIComponent(cookieValue)),
            };
          } catch (error) {
            console.error('Failed to parse cookie:', error);
          }
        }
        allPrefs[key] = newPrefs;
        setCookie('sitePreferences', JSON.stringify(allPrefs));
        updateRelayPreferences({[key]: newPrefs});

        if (refetchTimeoutRef.current) {
          clearTimeout(refetchTimeoutRef.current);
          refetchTimeoutRef.current = null;
        }

        refetchTimeoutRef.current = setTimeout(() => {
          if (refetchCallback) {
            refetchCallback(newPrefs);
          }
          refetchTimeoutRef.current = null;
        }, 250);

        return newPrefs;
      });
    },
    [key],
  );

  return {preferences, updatePreference, isHydrated};
}

// Usage examples:
// const {preferences, updatePreference} = usePreferences('commanders', DEFAULT_PREFERENCES.commanders);
// const {preferences, updatePreference} = usePreferences('entry', DEFAULT_PREFERENCES.entry);
// const {preferences, updatePreference} = usePreferences('tournament', DEFAULT_PREFERENCES.tournament);
// const {preferences, updatePreference} = usePreferences('tournaments', DEFAULT_PREFERENCES.tournaments);
