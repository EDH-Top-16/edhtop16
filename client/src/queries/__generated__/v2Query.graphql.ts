/**
 * @generated SignedSource<<2e6d07305ebce995443d6e031633ea90>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TopCommandersSortBy = "CONVERSION" | "POPULARITY" | "%future added value";
export type TopCommandersTimePeriod = "ONE_MONTH" | "SIX_MONTHS" | "THREE_MONTHS" | "%future added value";
export type v2Query$variables = {
  sortBy?: TopCommandersSortBy | null | undefined;
  timePeriod?: TopCommandersTimePeriod | null | undefined;
};
export type v2Query$data = {
  readonly topCommanders: ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"v2_TopCommandersCard">;
  }>;
};
export type v2Query = {
  response: v2Query$data;
  variables: v2Query$variables;
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
    "name": "v2Query",
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
            "name": "v2_TopCommandersCard"
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
    "name": "v2Query",
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
    "cacheID": "c75e3ab4ecb222efff1c51f74fc86b71",
    "id": null,
    "metadata": {},
    "name": "v2Query",
    "operationKind": "query",
    "text": "query v2Query(\n  $timePeriod: TopCommandersTimePeriod\n  $sortBy: TopCommandersSortBy\n) {\n  topCommanders(timePeriod: $timePeriod, sortBy: $sortBy) {\n    id\n    ...v2_TopCommandersCard\n  }\n}\n\nfragment v2_TopCommandersCard on Commander {\n  name\n  colorId\n  imageUrls\n  conversionRate(filters: {timePeriod: $timePeriod})\n  topCuts(filters: {timePeriod: $timePeriod})\n  count(filters: {timePeriod: $timePeriod})\n  breakdownUrl\n}\n"
  }
};
})();

(node as any).hash = "98de12998cf05249943365fb73b95615";

export default node;
