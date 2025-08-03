import { useState, useEffect, useCallback } from 'react';
import { updateRelayPreferences } from './relay_client_environment';
import type { CommandersSortBy, TimePeriod } from '#genfiles/queries/pages_CommandersQuery.graphql';

export interface CommanderPreferences {
  sortBy?: CommandersSortBy;
  timePeriod?: TimePeriod;
  colorId?: string;
  minEntries?: number;
  minTournamentSize?: number;
  display?: 'card' | 'table';
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
}

export function useCommanderPreferences() {
  const [preferences, setPreferences] = useState<CommanderPreferences>({});

  useEffect(() => {
    const cookieValue = getCookie('commanderPreferences');
    if (cookieValue) {
      try {
        const savedPrefs = JSON.parse(decodeURIComponent(cookieValue));
        setPreferences(savedPrefs);
        updateRelayPreferences(savedPrefs);
      } catch (error) {
        console.warn('Error parsing commander preferences from cookie:', error);
      }
    }
  }, []);

  const updatePreference = useCallback((key: keyof CommanderPreferences, value: any) => {
    const newPrefs = { ...preferences };
    if (!value || value === '' || value === null) {
      delete newPrefs[key];
    } else {
      newPrefs[key] = value;
    }
    setPreferences(newPrefs);
    setCookie('commanderPreferences', JSON.stringify(newPrefs));
    updateRelayPreferences(newPrefs);
  }, [preferences]);

  return {
    preferences,
    updatePreference,
  };
}