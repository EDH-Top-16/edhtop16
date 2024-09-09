/**
 * @generated SignedSource<<ed04f7f8c0b7debb0e707b5c3ecb2bb3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type v2Query$variables = Record<PropertyKey, never>;
export type v2Query$data = {
  readonly topCommanders: ReadonlyArray<{
    readonly name: string;
  }>;
};
export type v2Query = {
  response: v2Query$data;
  variables: v2Query$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "v2Query",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "topCommanders",
        "plural": true,
        "selections": [
          (v0/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "v2Query",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "topCommanders",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "c27098ba879b83ba82ac6bbea22f67b7",
    "id": null,
    "metadata": {},
    "name": "v2Query",
    "operationKind": "query",
    "text": "query v2Query {\n  topCommanders {\n    name\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "d86a5c1f13224510bbb0ae92ecd3bf17";

export default node;
