/**
 * @generated SignedSource<<67e1f12dcc82b8f00e77bceda9342a56>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type v2Query$variables = Record<PropertyKey, never>;
export type v2Query$data = {
  readonly commanders: ReadonlyArray<{
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
        "name": "commanders",
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
        "name": "commanders",
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
    "cacheID": "4f8d21f9db870f35d5d15aa86308f1e8",
    "id": null,
    "metadata": {},
    "name": "v2Query",
    "operationKind": "query",
    "text": "query v2Query {\n  commanders {\n    name\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "8a5cad822fbecfbee95cbf76ce367f07";

export default node;
