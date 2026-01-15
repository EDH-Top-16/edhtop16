/**
 * @generated SignedSource<<05571a123a53b272ff89a7764b0f0fad>>
 * @relayHash 622231bdaf45e2422524236dcc3a95dc
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 622231bdaf45e2422524236dcc3a95dc

import { ConcreteRequest } from 'relay-runtime';
export type SearchResultType = "COMMANDER" | "TOURNAMENT" | "%future added value";
export type searchbar_CommanderNamesQuery$variables = {
  searchTypes: ReadonlyArray<SearchResultType>;
};
export type searchbar_CommanderNamesQuery$data = {
  readonly searchResults: ReadonlyArray<{
    readonly name: string;
    readonly size: number | null | undefined;
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
    "id": "622231bdaf45e2422524236dcc3a95dc",
    "metadata": {},
    "name": "searchbar_CommanderNamesQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "ac2f72c7951e9829ff21cfc8f6f0a105";

export default node;
