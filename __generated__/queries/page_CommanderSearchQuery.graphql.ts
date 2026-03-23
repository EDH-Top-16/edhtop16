/**
 * @generated SignedSource<<b226c76a049f83d6323dcbb073e4a885>>
 * @relayHash ad5308c5c1763543149af8b4877a955a
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID ad5308c5c1763543149af8b4877a955a

import { ConcreteRequest } from 'relay-runtime';
export type page_CommanderSearchQuery$variables = Record<PropertyKey, never>;
export type page_CommanderSearchQuery$data = {
  readonly searchResults: ReadonlyArray<{
    readonly entries: number | null | undefined;
    readonly metaShare: number | null | undefined;
    readonly name: string;
    readonly topCuts: number | null | undefined;
    readonly url: string;
  }>;
};
export type page_CommanderSearchQuery = {
  response: page_CommanderSearchQuery$data;
  variables: page_CommanderSearchQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "types",
        "value": [
          "COMMANDER"
        ]
      }
    ],
    "concreteType": "SearchResult",
    "kind": "LinkedField",
    "name": "searchResults",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "url",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "entries",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "topCuts",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "metaShare",
        "storageKey": null
      }
    ],
    "storageKey": "searchResults(types:[\"COMMANDER\"])"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": {
      "throwOnFieldError": true
    },
    "name": "page_CommanderSearchQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "page_CommanderSearchQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "id": "ad5308c5c1763543149af8b4877a955a",
    "metadata": {},
    "name": "page_CommanderSearchQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "3dd70ab93436092d3e2a52f072c2c482";

export default node;
