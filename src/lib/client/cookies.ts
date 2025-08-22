import {useState, useEffect, useRef, useCallback} from 'react';
import {updateRelayPreferences} from './relay_client_environment';
import type {PreferencesMap} from '../shared/preferences-types';
import {DEFAULT_PREFERENCES} from '../shared/preferences-types';

let refetchCallback: ((prefs?: any) => void) | undefined = undefined;
let relayEnvironment: any = null;

export function setRefetchCallback(callback?: (prefs?: any) => void) {
  refetchCallback = callback;
}

export function clearRefetchCallback() {
  refetchCallback = undefined;
}

export function setRelayEnvironment(environment: any) {
  relayEnvironment = environment;
}

function getCookie(name: string): string | null {
  try {
    //console.log('getCookie - Looking for:', name);
    //console.log('getCookie - All cookies:', document.cookie);

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    //console.log('getCookie - Split parts:', parts);

    if (parts.length === 2) {
      const result = parts.pop()?.split(';').shift() || null;
      //console.log('getCookie - Found value:', result);
      return result;
    }
  } catch (error) {
    console.error('Failed to get cookie:', error);
  }

  //console.log('getCookie - Cookie not found, checking localStorage fallback');

  // Fallback to localStorage for development
  if (process.env.NODE_ENV === 'development') {
    try {
      const lsValue = localStorage.getItem(`cookie_${name}`);
      //console.log('getCookie - localStorage value:', lsValue);
      return lsValue;
    } catch (e) {
      console.warn('localStorage also unavailable');
    }
  }

  return null;
}

function setCookie(name: string, value: string, days: number = 365) {
  try {
    //console.log('setCookie - Input name:', name);
    //console.log('setCookie - Input value:', value);
    //console.log('setCookie - Value length:', value.length);

    const encodedValue = encodeURIComponent(value);
    //console.log('setCookie - Encoded value:', encodedValue);
    //console.log('setCookie - Encoded length:', encodedValue.length);

    // Check if the value is too long (cookies have ~4KB limit)
    if (encodedValue.length > 4000) {
      console.error('setCookie - Cookie value too long!', encodedValue.length);
      return;
    }

    const cookieString = `${name}=${encodedValue}`;
    //console.log('setCookie - Cookie string to set:', cookieString);

    // Set the cookie
    document.cookie = cookieString;

    //console.log('setCookie - Document.cookie after setting:', document.cookie);

    // Verify it was set
    const verification = getCookie(name);
    //console.log('setCookie - Verification read back:', verification);

    if (!verification) {
      console.error('setCookie - Cookie verification failed!');

      // Fallback to localStorage for development
      if (process.env.NODE_ENV === 'development') {
        try {
          localStorage.setItem(`cookie_${name}`, value);
          //console.log('setCookie - Saved to localStorage as fallback');
        } catch (e) {
          console.error('setCookie - localStorage also failed:', e);
        }
      }
    } else {
      //console.log('setCookie - Successfully set and verified cookie');
    }
  } catch (error) {
    console.error('setCookie - Exception:', error);
  }
}

export function usePreferences<K extends keyof PreferencesMap>(
  key: K,
  defaultPrefs: PreferencesMap[K],
): {
  preferences: PreferencesMap[K];
  updatePreference: <P extends keyof NonNullable<PreferencesMap[K]>>(
    prefKey: P,
    value: NonNullable<PreferencesMap[K]>[P],
  ) => void;
  isHydrated: boolean;
} {
  // Start with defaults to match server-side rendering
  const [preferences, setPreferences] =
    useState<PreferencesMap[K]>(defaultPrefs);
  const [isHydrated, setIsHydrated] = useState(false);
  const refetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasHydratedRef = useRef(false);

  // Store the initial values in refs to avoid dependency issues
  const keyRef = useRef(key);
  const defaultPrefsRef = useRef(defaultPrefs);

  // Update refs when values change (but don't retrigger the effect)
  keyRef.current = key;
  defaultPrefsRef.current = defaultPrefs;

  useEffect(() => {
    const currentKey = keyRef.current;
    const currentDefaultPrefs = defaultPrefsRef.current;

    //console.log('usePreferences effect starting - key:', currentKey, 'hasHydrated:', hasHydratedRef.current);

    if (hasHydratedRef.current) return;
    hasHydratedRef.current = true;

    // Only run on client after hydration
    if (typeof window === 'undefined') {
      //console.log('usePreferences - running on server, skipping');
      return;
    }

    //console.log('usePreferences - running client hydration for key:', currentKey);
    setIsHydrated(true);

    // Debug: Check what cookies are available
    //console.log('Client hydration - All cookies available:', document.cookie);
    //console.log('Client hydration - Location:', window.location.href);

    // Check if server provided preferences for hydration
    const serverPreferences = (window as any).__SERVER_PREFERENCES__;
    //console.log('Client hydration - Server preferences from window:', serverPreferences);

    let allPrefs: PreferencesMap = {...DEFAULT_PREFERENCES};

    if (serverPreferences) {
      // Use server preferences for initial hydration
      allPrefs = {
        ...allPrefs,
        ...serverPreferences,
      };
      //console.log('Using server preferences for hydration:', serverPreferences);
    } else {
      // Fallback to reading cookies if no server preferences
      const cookieValue = getCookie('sitePreferences');
      //console.log('Hydration - Raw cookie value:', cookieValue);

      if (cookieValue) {
        try {
          const parsed = JSON.parse(decodeURIComponent(cookieValue));
          //console.log('Hydration - Parsed preferences:', parsed);
          allPrefs = {
            ...allPrefs,
            ...parsed,
          };
        } catch (error) {
          console.error('Failed to parse cookie:', error);
        }
      } else {
        //console.log('Client hydration - No sitePreferences cookie found in:', document.cookie);
      }
    }

    const finalPrefs = allPrefs[currentKey] || currentDefaultPrefs;
    //console.log('Hydration - Final preferences for', currentKey, ':', finalPrefs);
    //console.log('Hydration - Default preferences:', currentDefaultPrefs);

    // Always update after hydration to sync with server state
    setPreferences(finalPrefs);
    updateRelayPreferences({[currentKey]: finalPrefs});

    // Small delay to ensure Relay environment is ready
    setTimeout(() => {
      refetchCallback?.(finalPrefs);
    }, 100);
  }, []); // Empty dependency array is now correct since we use refs

  const updatePreference = useCallback(
    <P extends keyof NonNullable<PreferencesMap[K]>>(
      prefKey: P,
      value: NonNullable<PreferencesMap[K]>[P],
    ) => {
      const currentKey = keyRef.current;

      //console.log('updatePreference called with:', { prefKey, value, key: currentKey });

      // Only invalidate cache for data-affecting preferences, not UI preferences
      const dataAffectingPrefs = ['timePeriod', 'sortBy', 'minEntries', 'minTournamentSize', 'colorId'];
      const shouldInvalidateCache = dataAffectingPrefs.includes(prefKey as string);

      if (shouldInvalidateCache && relayEnvironment) {
        // Temporarily disabled cache invalidation to prevent blink
        // TODO: Re-enable if needed for other scenarios
        /*
        try {
          const store = relayEnvironment.getStore();
          
          // Strategy 1: Try to invalidate the root query record
          try {
            store.invalidateRecord('client:root');
          } catch (e1) {
            // Strategy 2: Try to get and invalidate the connection record
            try {
              const rootRecord = store.getRoot();
              if (rootRecord) {
                store.invalidateRecord(rootRecord.getDataID());
              }
            } catch (e2) {
              // Strategy 3: Force a complete store refresh (nuclear option)
              try {
                relayEnvironment.getStore().publish(relayEnvironment.getStore().getSource());
              } catch (e3) {
                console.warn('All Relay cache invalidation strategies failed:', {e1, e2, e3});
              }
            }
          }
        } catch (error) {
          console.warn('Failed to invalidate Relay cache:', error);
        }
        */
      }

      setPreferences((prevPrefs) => {
        //console.log('updatePreference - Previous preferences:', prevPrefs);

        const newPrefs = {...(prevPrefs ?? {})} as PreferencesMap[K];
        if (!value && value !== 0) {
          delete (newPrefs as any)[prefKey];
        } else {
          (newPrefs as any)[prefKey] = value;
        }

        //console.log('updatePreference - New preferences for', currentKey, ':', newPrefs);

        let allPrefs: PreferencesMap = {...DEFAULT_PREFERENCES};
        const cookieValue = getCookie('sitePreferences');
        //console.log('updatePreference - Current cookie value:', cookieValue);

        if (cookieValue) {
          try {
            allPrefs = {
              ...allPrefs,
              ...JSON.parse(decodeURIComponent(cookieValue)),
            };
            //console.log('updatePreference - Parsed existing preferences:', allPrefs);
          } catch (error) {
            console.error('Failed to parse existing cookie:', error);
          }
        }

        allPrefs[currentKey] = newPrefs;
        //console.log('updatePreference - All preferences to save:', allPrefs);

        const jsonToSave = JSON.stringify(allPrefs);
        //console.log('updatePreference - JSON to save:', jsonToSave);
        //console.log('updatePreference - JSON length:', jsonToSave.length);

        setCookie('sitePreferences', jsonToSave);
        updateRelayPreferences({[currentKey]: newPrefs});

        if (refetchTimeoutRef.current) {
          clearTimeout(refetchTimeoutRef.current);
          refetchTimeoutRef.current = null;
        }

        // Only trigger refetch for data-affecting preferences
        const dataAffectingPrefs = ['timePeriod', 'sortBy', 'minEntries', 'minTournamentSize', 'colorId'];
        const shouldTriggerRefetch = dataAffectingPrefs.includes(prefKey as string);

        if (shouldTriggerRefetch) {
          refetchTimeoutRef.current = setTimeout(() => {
            if (refetchCallback) {
              refetchCallback(newPrefs);
            }
            refetchTimeoutRef.current = null;
          }, 250);
        }

        return newPrefs;
      });
    },
    [], // Empty dependency array since we use refs
  );

  return {preferences, updatePreference, isHydrated};
}

// Re-export types for convenience
export type {PreferencesMap} from '../shared/preferences-types';
export {DEFAULT_PREFERENCES} from '../shared/preferences-types';

// Usage examples:
// const {preferences, updatePreference} = usePreferences('commanders', DEFAULT_PREFERENCES.commanders);
// const {preferences, updatePreference} = usePreferences('entry', DEFAULT_PREFERENCES.entry);
// const {preferences, updatePreference} = usePreferences('tournament', DEFAULT_PREFERENCES.tournament);
// const {preferences, updatePreference} = usePreferences('tournaments', DEFAULT_PREFERENCES.tournaments);
