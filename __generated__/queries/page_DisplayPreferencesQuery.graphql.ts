/**
 * @generated SignedSource<<33ec53765e999535cd406713db8486e6>>
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
export type page_DisplayPreferencesQuery$variables = Record<PropertyKey, never>;
export type page_DisplayPreferencesQuery$data = {
  readonly displayPreferences: {
    readonly listStyle: string | null | undefined;
  } | null | undefined;
};
export type page_DisplayPreferencesQuery = {
  response: page_DisplayPreferencesQuery$data;
  variables: page_DisplayPreferencesQuery$variables;
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
    "name": "page_DisplayPreferencesQuery",
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
    "name": "page_DisplayPreferencesQuery",
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
    "cacheID": "fa6c1c76fda4805959fae2fcbd915dd5",
    "id": null,
    "metadata": {},
    "name": "page_DisplayPreferencesQuery",
    "operationKind": "query",
    "text": null
  }
};

(node as any).hash = "ec36c90d9e3522e55a1102ff8b8a0891";

export default node;
