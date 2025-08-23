import {useState, useEffect, useRef, useCallback} from 'react';
import {updateRelayPreferences} from './relay_client_environment';
import type {PreferencesMap} from '../shared/preferences-types';
import {DEFAULT_PREFERENCES} from '../shared/preferences-types';
import {getCurrentPreferences, setCookieValue} from '../shared/cookie-utils';

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
  const [preferences, setPreferences] =
    useState<PreferencesMap[K]>(defaultPrefs);
  const [isHydrated, setIsHydrated] = useState(false);
  const refetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasHydratedRef = useRef(false);

  const keyRef = useRef(key);
  const defaultPrefsRef = useRef(defaultPrefs);

  keyRef.current = key;
  defaultPrefsRef.current = defaultPrefs;

  useEffect(() => {
    if (hasHydratedRef.current) return;
    hasHydratedRef.current = true;

    if (typeof window === 'undefined') return;

    setIsHydrated(true);

    const currentPrefs = getCurrentPreferences();
    const keyPrefs = currentPrefs[keyRef.current] || defaultPrefsRef.current;

    setPreferences(keyPrefs);
    updateRelayPreferences({[keyRef.current]: keyPrefs});

    setTimeout(() => {
      refetchCallback?.(keyPrefs);
    }, 100);
  }, []);

  const updatePreference = useCallback(
    <P extends keyof NonNullable<PreferencesMap[K]>>(
      prefKey: P,
      value: NonNullable<PreferencesMap[K]>[P],
    ) => {
      const currentKey = keyRef.current;

      setPreferences((prevPrefs) => {
        const newPrefs = {...(prevPrefs ?? {})} as PreferencesMap[K];

        if (!value && value !== 0) {
          delete (newPrefs as any)[prefKey];
        } else {
          (newPrefs as any)[prefKey] = value;
        }

        const allCurrentPrefs = getCurrentPreferences();
        const updatedAllPrefs = {
          ...allCurrentPrefs,
          [currentKey]: newPrefs,
        };

        const jsonToSave = JSON.stringify(updatedAllPrefs);
        setCookieValue('sitePreferences', jsonToSave);
        updateRelayPreferences({[currentKey]: newPrefs});

        if (refetchTimeoutRef.current) {
          clearTimeout(refetchTimeoutRef.current);
          refetchTimeoutRef.current = null;
        }

        const dataAffectingPrefs = [
          'timePeriod',
          'sortBy',
          'minEntries',
          'minTournamentSize',
          'colorId',
        ];
        const shouldTriggerRefetch = dataAffectingPrefs.includes(
          prefKey as string,
        );

        if (shouldTriggerRefetch) {
          refetchTimeoutRef.current = setTimeout(() => {
            refetchCallback?.(newPrefs);
            refetchTimeoutRef.current = null;
          }, 250);
        }

        return newPrefs;
      });
    },
    [],
  );

  return {preferences, updatePreference, isHydrated};
}

export type {PreferencesMap} from '../shared/preferences-types';
export {DEFAULT_PREFERENCES} from '../shared/preferences-types';
