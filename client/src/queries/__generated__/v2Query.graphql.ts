/**
 * @generated SignedSource<<59881a688873f1aabe971c27c389b115>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TopCommandersTimePeriod = "ONE_MONTH" | "SIX_MONTHS" | "THREE_MONTHS" | "%future added value";
export type v2Query$variables = {
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
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "timePeriod"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "timePeriod",
    "variableName": "timePeriod"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = [
  {
    "fields": (v1/*: any*/),
    "kind": "ObjectValue",
    "name": "filters"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "v2Query",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "topCommanders",
        "plural": true,
        "selections": [
          (v2/*: any*/),
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "v2Query",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "topCommanders",
        "plural": true,
        "selections": [
          (v2/*: any*/),
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
            "args": (v3/*: any*/),
            "kind": "ScalarField",
            "name": "conversionRate",
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v3/*: any*/),
            "kind": "ScalarField",
            "name": "topCuts",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "7722a45bf2a24025e755f20211f9f8e8",
    "id": null,
    "metadata": {},
    "name": "v2Query",
    "operationKind": "query",
    "text": "query v2Query(\n  $timePeriod: TopCommandersTimePeriod\n) {\n  topCommanders(timePeriod: $timePeriod) {\n    id\n    ...v2_TopCommandersCard\n  }\n}\n\nfragment v2_TopCommandersCard on Commander {\n  name\n  colorId\n  imageUrls\n  conversionRate(filters: {timePeriod: $timePeriod})\n  topCuts(filters: {timePeriod: $timePeriod})\n}\n"
  }
};
})();

(node as any).hash = "d5c69dce962735399b466db27b934e8f";

export default node;
