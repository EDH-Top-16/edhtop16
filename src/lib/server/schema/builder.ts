import SchemaBuilder from '@pothos/core';
import DataloaderPlugin from '@pothos/plugin-dataloader';
import RelayPlugin from '@pothos/plugin-relay';
import {TopdeckClient} from '../topdeck';
import type {PreferencesMap} from '../../client/cookies';

export interface Context {
  topdeckClient: TopdeckClient;
  preferences: PreferencesMap;
  setPreferences: (prefs: PreferencesMap) => void;
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
