import {Context} from './schema/builder';
import {TopdeckClient} from './topdeck';
import type { PreferencesMap } from '../shared/preferences-types';
import { getPreferencesFromRequest } from './cookies';

export function createContext(
  request?: Request,
  preferences?: Partial<PreferencesMap>
): Context {
  // If no preferences provided but we have a request, extract from cookies
  const finalPreferences = preferences || (request ? getPreferencesFromRequest(request) : {});
  
  return {
    topdeckClient: new TopdeckClient(),
    preferences: finalPreferences,
    request,
  };
}
