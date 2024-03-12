/**
 * @generated SignedSource<<1d45b39726df8b3c833c9fd4aa3e227c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type csvExport_CommandersQuery$variables = Record<PropertyKey, never>;
export type csvExport_CommandersQuery$data = {
  readonly commanders: ReadonlyArray<{
    readonly colorId: string;
    readonly conversionRate: number;
    readonly count: number;
    readonly name: string;
    readonly topCuts: number;
  }>;
};
export type csvExport_CommandersQuery = {
  response: csvExport_CommandersQuery$data;
  variables: csvExport_CommandersQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "colorId",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "count",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "topCuts",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "conversionRate",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "csvExport_CommandersQuery",
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
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/)
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
    "name": "csvExport_CommandersQuery",
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
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
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
    "cacheID": "a32d93c1eae1ea83025aff4597c5cb86",
    "id": null,
    "metadata": {},
    "name": "csvExport_CommandersQuery",
    "operationKind": "query",
    "text": "query csvExport_CommandersQuery {\n  commanders {\n    name\n    colorId\n    count\n    topCuts\n    conversionRate\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "10202ef20fdfb766d427c36c3594eeff";

export default node;
