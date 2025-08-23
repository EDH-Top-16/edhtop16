import type {PreferencesMap} from '../shared/preferences-types';
import {getPreferencesFromCookieString} from '../shared/cookie-utils';

export function getPreferencesFromRequest(request: Request): PreferencesMap {
  const cookieHeader = request.headers.get('cookie') || '';
  return getPreferencesFromCookieString(cookieHeader);
}

export {
  parseCookies,
  getPreferencesFromCookieString,
} from '../shared/cookie-utils';
