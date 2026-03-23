/**
 * @generated SignedSource<<8cbb966472f6fb5400584b4818f502ec>>
 * @relayHash adb86c7711e577a33ffd053410380b2b
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID adb86c7711e577a33ffd053410380b2b

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CommandersSortBy = "CONVERSION" | "POPULARITY" | "TOP_CUTS" | "WINRATE" | "%future added value";
export type TimePeriod = "ALL_TIME" | "ONE_MONTH" | "ONE_YEAR" | "POST_BAN" | "SIX_MONTHS" | "THREE_MONTHS" | "%future added value";
export type page_CommandersQuery$variables = {
  colorId?: string | null | undefined;
  minEntries?: number | null | undefined;
  minSize?: number | null | undefined;
  sortBy?: CommandersSortBy | null | undefined;
  timePeriod?: TimePeriod | null | undefined;
};
export type page_CommandersQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"page_topCommanders">;
};
export type page_CommandersQuery = {
  response: page_CommandersQuery$data;
  variables: page_CommandersQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "colorId"
},
v1 = {
  "defaultValue": 20,
  "kind": "LocalArgument",
  "name": "minEntries"
},
v2 = {
  "defaultValue": 50,
  "kind": "LocalArgument",
  "name": "minSize"
},
v3 = {
  "defaultValue": "POPULARITY",
  "kind": "LocalArgument",
  "name": "sortBy"
},
v4 = {
  "defaultValue": "SIX_MONTHS",
  "kind": "LocalArgument",
  "name": "timePeriod"
},
v5 = {
  "kind": "Variable",
  "name": "timePeriod",
  "variableName": "timePeriod"
},
v6 = [
  {
    "kind": "Variable",
    "name": "colorId",
    "variableName": "colorId"
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 48
  },
  {
    "kind": "Variable",
    "name": "minEntries",
    "variableName": "minEntries"
  },
  {
    "kind": "Variable",
    "name": "minTournamentSize",
    "variableName": "minSize"
  },
  {
    "kind": "Variable",
    "name": "sortBy",
    "variableName": "sortBy"
  },
  (v5/*: any*/)
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": {
      "throwOnFieldError": true
    },
    "name": "page_CommandersQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "page_topCommanders"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v4/*: any*/),
      (v3/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "page_CommandersQuery",
    "selections": [
      {
        "alias": null,
        "args": (v6/*: any*/),
        "concreteType": "CommanderConnection",
        "kind": "LinkedField",
        "name": "commanders",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "CommanderEdge",
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
                  (v7/*: any*/),
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
                    "name": "breakdownUrl",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": [
                      {
                        "fields": [
                          {
                            "kind": "Variable",
                            "name": "minSize",
                            "variableName": "minSize"
                          },
                          (v5/*: any*/)
                        ],
                        "kind": "ObjectValue",
                        "name": "filters"
                      }
                    ],
                    "concreteType": "CommanderCalculatedStats",
                    "kind": "LinkedField",
                    "name": "stats",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "conversionRate",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "topCuts",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "count",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "metaShare",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "winRate",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Card",
                    "kind": "LinkedField",
                    "name": "cards",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "imageUrls",
                        "storageKey": null
                      },
                      (v7/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__typename",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cursor",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "PageInfo",
            "kind": "LinkedField",
            "name": "pageInfo",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "endCursor",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hasNextPage",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v6/*: any*/),
        "filters": [
          "timePeriod",
          "sortBy",
          "colorId",
          "minEntries",
          "minTournamentSize"
        ],
        "handle": "connection",
        "key": "page__commanders",
        "kind": "LinkedHandle",
        "name": "commanders"
      }
    ]
  },
  "params": {
    "id": "adb86c7711e577a33ffd053410380b2b",
    "metadata": {},
    "name": "page_CommandersQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "90267924f11e360eaeca3e8e55335f57";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
