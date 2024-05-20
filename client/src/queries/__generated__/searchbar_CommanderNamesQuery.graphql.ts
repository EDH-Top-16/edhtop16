/**
 * @generated SignedSource<<c0657d815014173be189521d66371e09>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type searchbar_CommanderNamesQuery$variables = Record<PropertyKey, never>;
export type searchbar_CommanderNamesQuery$data = {
  readonly commanderNames: ReadonlyArray<string>;
};
export type searchbar_CommanderNamesQuery = {
  response: searchbar_CommanderNamesQuery$data;
  variables: searchbar_CommanderNamesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "commanderNames",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "searchbar_CommanderNamesQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "searchbar_CommanderNamesQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "d0a80fad06813a36a9ad732662633dfd",
    "id": null,
    "metadata": {},
    "name": "searchbar_CommanderNamesQuery",
    "operationKind": "query",
    "text": "query searchbar_CommanderNamesQuery {\n  commanderNames\n}\n"
  }
};
})();

(node as any).hash = "f7d404689ad403e7d1e6b61213af457e";

export default node;
