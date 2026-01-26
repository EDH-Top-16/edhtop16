import {commanderDisplayPreferences_DisplayPreferencesQuery} from '#genfiles/queries/commanderDisplayPreferences_DisplayPreferencesQuery.graphql.js';
import {useCallback, useMemo} from 'react';
import {graphql, useClientQuery} from 'react-relay';
import {LIST_STYLE_COOKIE_NAME} from './display_preferences';

export function useCommandersDisplay() {
  const {displayPreferences} =
    useClientQuery<commanderDisplayPreferences_DisplayPreferencesQuery>(
      graphql`
        query commanderDisplayPreferences_DisplayPreferencesQuery {
          displayPreferences {
            listStyle
          }
        }
      `,
      {},
    );

  const listStyle = displayPreferences?.listStyle;

  const toggleDisplay = useCallback(() => {
    window.cookieStore.set(
      LIST_STYLE_COOKIE_NAME,
      listStyle === 'table' ? 'card' : 'table',
    );
  }, [listStyle]);

  return useMemo(() => {
    return [listStyle === 'table' ? 'table' : 'card', toggleDisplay] as const;
  }, [listStyle, toggleDisplay]);
}
