/**
 * @generated SignedSource<<e90986e9122b7b6f3cd997e9c28cf078>>
 * @relayHash 4aa21fe7b4c328091aaeaadbc1a88c24
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 4aa21fe7b4c328091aaeaadbc1a88c24

import { ConcreteRequest } from 'relay-runtime';
export type SearchResultType = "COMMANDER" | "TOURNAMENT" | "%future added value";
export type searchbar_CommanderNamesQuery$variables = {
  searchTypes: ReadonlyArray<SearchResultType>;
};
export type searchbar_CommanderNamesQuery$data = {
  readonly searchResults: ReadonlyArray<{
    readonly entries: number | null | undefined;
    readonly metaShare: number | null | undefined;
    readonly name: string;
    readonly size: number | null | undefined;
    readonly topCuts: number | null | undefined;
    readonly topdeckUrl: string | null | undefined;
    readonly tournamentDate: string | null | undefined;
    readonly url: string;
    readonly winnerName: string | null | undefined;
  }>;
};
export type searchbar_CommanderNamesQuery = {
  response: searchbar_CommanderNamesQuery$data;
  variables: searchbar_CommanderNamesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "searchTypes"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "types",
        "variableName": "searchTypes"
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
        "name": "tournamentDate",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "size",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "topdeckUrl",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "winnerName",
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
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": {
      "throwOnFieldError": true
    },
    "name": "searchbar_CommanderNamesQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "searchbar_CommanderNamesQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "4aa21fe7b4c328091aaeaadbc1a88c24",
    "metadata": {},
    "name": "searchbar_CommanderNamesQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "d46cd7fa823ee9c587a226cf563c60bd";

export default node;
