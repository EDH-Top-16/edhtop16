import SchemaBuilder from '@pothos/core';
import DataloaderPlugin from '@pothos/plugin-dataloader';
import RelayPlugin from '@pothos/plugin-relay';
import {TopdeckClient} from '../topdeck';
import type {PreferencesMap} from '../../shared/preferences-types';

export interface Context {
  topdeckClient: TopdeckClient;
  preferences: Partial<PreferencesMap>; // Keep for backward compatibility
  relayContext: PreferencesMap; // New explicit Relay context property
  request?: Request;
  // Add dataloaders and cache for completeness
  dataloaders?: any;
  cache?: Map<string, any>;
}

export const builder = new SchemaBuilder<{
  Context: Context;
  DefaultFieldNullability: false;
}>({
  plugins: [RelayPlugin, DataloaderPlugin],
  relay: {},
  defaultFieldNullability: false,
});

builder.queryType({});

// Helper function for resolvers to get typed context preferences
export function getContextPreferences<K extends keyof PreferencesMap>(
  context: Context,
  key: K
): PreferencesMap[K] {
  return context.relayContext[key] || context.preferences[key] || {};
}