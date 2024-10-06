/**
 * @generated SignedSource<<de629ba3efe6ff2c56dcb71a2bae3981>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TimePeriod = "ONE_MONTH" | "SIX_MONTHS" | "THREE_MONTHS" | "%future added value";
export type TopCommandersSortBy = "CONVERSION" | "POPULARITY" | "%future added value";
export type pages_CommandersQuery$variables = {
  sortBy: TopCommandersSortBy;
  timePeriod: TimePeriod;
};
export type pages_CommandersQuery$data = {
  readonly topCommanders: ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"pages_TopCommandersCard">;
  }>;
};
export type pages_CommandersQuery = {
  response: pages_CommandersQuery$data;
  variables: pages_CommandersQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortBy"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "timePeriod"
},
v2 = {
  "kind": "Variable",
  "name": "timePeriod",
  "variableName": "timePeriod"
},
v3 = [
  {
    "kind": "Variable",
    "name": "sortBy",
    "variableName": "sortBy"
  },
  (v2/*: any*/)
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = [
  {
    "fields": [
      (v2/*: any*/)
    ],
    "kind": "ObjectValue",
    "name": "filters"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "pages_CommandersQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "topCommanders",
        "plural": true,
        "selections": [
          (v4/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "pages_TopCommandersCard"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "pages_CommandersQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "topCommanders",
        "plural": true,
        "selections": [
          (v4/*: any*/),
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
            "name": "colorId",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "imageUrls",
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v5/*: any*/),
            "kind": "ScalarField",
            "name": "conversionRate",
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v5/*: any*/),
            "kind": "ScalarField",
            "name": "topCuts",
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v5/*: any*/),
            "kind": "ScalarField",
            "name": "count",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "breakdownUrl",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "55d666678d7d77e0ed272428a3fbd821",
    "id": null,
    "metadata": {},
    "name": "pages_CommandersQuery",
    "operationKind": "query",
    "text": "query pages_CommandersQuery(\n  $timePeriod: TimePeriod!\n  $sortBy: TopCommandersSortBy!\n) {\n  topCommanders(timePeriod: $timePeriod, sortBy: $sortBy) {\n    id\n    ...pages_TopCommandersCard\n  }\n}\n\nfragment pages_TopCommandersCard on Commander {\n  name\n  colorId\n  imageUrls\n  conversionRate(filters: {timePeriod: $timePeriod})\n  topCuts(filters: {timePeriod: $timePeriod})\n  count(filters: {timePeriod: $timePeriod})\n  breakdownUrl\n}\n"
  }
};
})();

(node as any).hash = "600b418894b620dc737eae39ac7abf74";

export default node;
