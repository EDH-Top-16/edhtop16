/**
 * @generated SignedSource<<7f61eb405c4f8bacaa0ae1f2fbe37990>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CommandersSortBy = "CONVERSION" | "POPULARITY" | "%future added value";
export type TimePeriod = "ALL_TIME" | "ONE_MONTH" | "ONE_YEAR" | "SIX_MONTHS" | "THREE_MONTHS" | "POST_BAN";
export type pages_CommandersQuery$variables = {
  sortBy: CommandersSortBy;
  timePeriod: TimePeriod;
};
export type pages_CommandersQuery$data = {
  readonly commanders: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"pages_TopCommandersCard">;
      };
    }>;
  };
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
    "kind": "Literal",
    "name": "first",
    "value": 48
  },
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
        "concreteType": "QueryCommandersConnection",
        "kind": "LinkedField",
        "name": "commanders",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "QueryCommandersConnectionEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Commander",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
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
            "storageKey": null
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
        "concreteType": "QueryCommandersConnection",
        "kind": "LinkedField",
        "name": "commanders",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "QueryCommandersConnectionEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Commander",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
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
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "39a3f27dd9b914f832557a4559041123",
    "id": null,
    "metadata": {},
    "name": "pages_CommandersQuery",
    "operationKind": "query",
    "text": "query pages_CommandersQuery(\n  $timePeriod: TimePeriod!\n  $sortBy: CommandersSortBy!\n) {\n  commanders(first: 48, timePeriod: $timePeriod, sortBy: $sortBy) {\n    edges {\n      node {\n        id\n        ...pages_TopCommandersCard\n      }\n    }\n  }\n}\n\nfragment pages_TopCommandersCard on Commander {\n  name\n  colorId\n  imageUrls\n  conversionRate(filters: {timePeriod: $timePeriod})\n  topCuts(filters: {timePeriod: $timePeriod})\n  count(filters: {timePeriod: $timePeriod})\n  breakdownUrl\n}\n"
  }
};
})();

(node as any).hash = "560351b438584b568044450a8739d70f";

export default node;
