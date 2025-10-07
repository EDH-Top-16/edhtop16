import Cookies from 'js-cookie';
import type {RelayResolverContext} from 'pastoria-runtime';
import type {LiveState} from 'relay-runtime';

export const LIST_STYLE_COOKIE_NAME = 'edhtop16ListStyle';

/**
 * @RelayResolver DisplayPreferences
 * @weak
 */
export type DisplayPreferences = {listStyle: string};

/**
 * @RelayResolver DisplayPreferences.listStyle: String
 */
export function listStyle(parent: DisplayPreferences) {
  return parent.listStyle;
}

/**
 * @RelayResolver Query.displayPreferences: DisplayPreferences
 * @live
 */
export function displayPreferences(
  _root: unknown,
  context: RelayResolverContext,
): LiveState<DisplayPreferences> {
  return {
    read() {
      const listStyle =
        typeof window !== 'undefined'
          ? Cookies.get(LIST_STYLE_COOKIE_NAME)
          : context.cookies?.[LIST_STYLE_COOKIE_NAME];

      return {listStyle};
    },
    subscribe(callback) {
      if (typeof window === 'undefined') {
        return () => {};
      }

      function listener(e: CookieChangeEvent) {
        const listStyleDidChange = e.changed.some(
          (c) => c.name === LIST_STYLE_COOKIE_NAME,
        );

        if (listStyleDidChange) callback();
      }

      window.cookieStore.addEventListener('change', listener);
      return () => {
        window.cookieStore.removeEventListener('change', listener);
      };
    },
  };
}
