import {Context} from './schema/builder';
import {TopdeckClient} from './topdeck';
import type {PreferencesMap} from '#src/lib/client/cookies';

export function createContext(
  topdeckClient: TopdeckClient,
  preferences: PreferencesMap,
  setPreferences: (prefs: PreferencesMap) => void,
): Context {
  return {
    topdeckClient,
    preferences,
    setPreferences,
  };
}
