/**
 * @generated SignedSource<<4b0c47b4067a8cd8850a2ddb4e964f5d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type SearchResultType = "COMMANDER" | "TOURNAMENT" | "%future added value";
export type searchbar_CommanderNamesQuery$variables = {
  searchTypes: ReadonlyArray<SearchResultType>;
};
export type searchbar_CommanderNamesQuery$data = {
  readonly searchResults: ReadonlyArray<{
    readonly name: string;
    readonly url: string;
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
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
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
    "cacheID": "f5a13fa4bfbf171fe18cd4cb0af93921",
    "id": null,
    "metadata": {},
    "name": "searchbar_CommanderNamesQuery",
    "operationKind": "query",
    "text": "query searchbar_CommanderNamesQuery(\n  $searchTypes: [SearchResultType!]!\n) {\n  searchResults(types: $searchTypes) {\n    name\n    url\n  }\n}\n"
  }
};
})();

(node as any).hash = "3df9ad8d7a259e942b61f266c6c356aa";

export default node;
