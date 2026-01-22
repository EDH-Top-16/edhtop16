/**
 * @generated SignedSource<<7d93bdc5f32fbdc047e53fc58d14340d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { LiveState, FragmentRefs } from "relay-runtime";
import { listStyle as displayPreferencesListStyleResolverType } from "../../src/lib/client/display_preferences";
// Type assertion validating that `displayPreferencesListStyleResolverType` resolver is correctly implemented.
// A type error here indicates that the type signature of the resolver module is incorrect.
(displayPreferencesListStyleResolverType satisfies (
  __relay_model_instance: DisplayPreferences____relay_model_instance$data['__relay_model_instance'],
) => string | null | undefined);
import { displayPreferences as queryDisplayPreferencesResolverType } from "../../src/lib/client/display_preferences";
// Type assertion validating that `queryDisplayPreferencesResolverType` resolver is correctly implemented.
// A type error here indicates that the type signature of the resolver module is incorrect.
(queryDisplayPreferencesResolverType satisfies () => LiveState<DisplayPreferences | null | undefined>);
import { DisplayPreferences } from "../../src/lib/client/display_preferences";
export type commanderDisplayPreferences_DisplayPreferencesQuery$variables = Record<PropertyKey, never>;
export type commanderDisplayPreferences_DisplayPreferencesQuery$data = {
  readonly displayPreferences: {
    readonly listStyle: string | null | undefined;
  } | null | undefined;
};
export type commanderDisplayPreferences_DisplayPreferencesQuery = {
  response: commanderDisplayPreferences_DisplayPreferencesQuery$data;
  variables: commanderDisplayPreferences_DisplayPreferencesQuery$variables;
};

import {displayPreferences as queryDisplayPreferencesResolver} from '../../src/lib/client/display_preferences';
import {listStyle as displayPreferencesListStyleResolver} from '../../src/lib/client/display_preferences';
import DisplayPreferences____relay_model_instance_graphql from './DisplayPreferences____relay_model_instance.graphql';
import {resolverDataInjector} from 'relay-runtime/experimental';

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": {
      "hasClientEdges": true
    },
    "name": "commanderDisplayPreferences_DisplayPreferencesQuery",
    "selections": [
      {
        "kind": "ClientEdgeToClientObject",
        "concreteType": "DisplayPreferences",
        "modelResolvers": null,
        "backingField": {
          "alias": null,
          "args": null,
          "fragment": null,
          "kind": "RelayLiveResolver",
          "name": "displayPreferences",
          "resolverModule": queryDisplayPreferencesResolver,
          "path": "displayPreferences",
          "normalizationInfo": {
            "kind": "WeakModel",
            "concreteType": "DisplayPreferences",
            "plural": false
          }
        },
        "linkedField": {
          "alias": null,
          "args": null,
          "concreteType": "DisplayPreferences",
          "kind": "LinkedField",
          "name": "displayPreferences",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "fragment": {
                "args": null,
                "kind": "FragmentSpread",
                "name": "DisplayPreferences____relay_model_instance"
              },
              "kind": "RelayResolver",
              "name": "listStyle",
              "resolverModule": resolverDataInjector(DisplayPreferences____relay_model_instance_graphql, displayPreferencesListStyleResolver, '__relay_model_instance', true),
              "path": "displayPreferences.listStyle"
            }
          ],
          "storageKey": null
        }
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "commanderDisplayPreferences_DisplayPreferencesQuery",
    "selections": [
      {
        "kind": "ClientEdgeToClientObject",
        "backingField": {
          "name": "displayPreferences",
          "args": null,
          "fragment": null,
          "kind": "RelayResolver",
          "storageKey": null,
          "isOutputType": true
        },
        "linkedField": {
          "alias": null,
          "args": null,
          "concreteType": "DisplayPreferences",
          "kind": "LinkedField",
          "name": "displayPreferences",
          "plural": false,
          "selections": [
            {
              "name": "listStyle",
              "args": null,
              "fragment": {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__relay_model_instance",
                    "storageKey": null
                  }
                ],
                "type": "DisplayPreferences",
                "abstractKey": null
              },
              "kind": "RelayResolver",
              "storageKey": null,
              "isOutputType": true
            }
          ],
          "storageKey": null
        }
      }
    ]
  },
  "params": {
    "cacheID": "6fdfc1625fd773a3a31a50e4f252ee97",
    "id": null,
    "metadata": {},
    "name": "commanderDisplayPreferences_DisplayPreferencesQuery",
    "operationKind": "query",
    "text": null
  }
};

(node as any).hash = "cb4f48bced97379a4e1943bf9336f0a5";

export default node;
