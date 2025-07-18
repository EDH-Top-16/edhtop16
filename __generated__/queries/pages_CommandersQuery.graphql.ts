/**
 * @generated SignedSource<<ba5a486e1c5a1e9c65e3922688066ce4>>
 * @relayHash 14745cc7afd103bd6a5ec872679047e4
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 14745cc7afd103bd6a5ec872679047e4

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CommandersSortBy = "CONVERSION" | "POPULARITY" | "TOP_CUTS" | "%future added value";
export type TimePeriod = "ALL_TIME" | "ONE_MONTH" | "ONE_YEAR" | "POST_BAN" | "SIX_MONTHS" | "THREE_MONTHS" | "%future added value";
export type pages_CommandersQuery$variables = {
  colorId?: string | null | undefined;
  minEntries: number;
  minTournamentSize: number;
  sortBy: CommandersSortBy;
  timePeriod: TimePeriod;
};
export type pages_CommandersQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"pages_topCommanders">;
};
export type pages_CommandersQuery = {
  response: pages_CommandersQuery$data;
  variables: pages_CommandersQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "colorId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minEntries"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minTournamentSize"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortBy"
},
v4 = {
  "defaultValue": null,
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
    "variableName": "minTournamentSize"
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
    "metadata": null,
    "name": "pages_CommandersQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "pages_topCommanders"
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
    "name": "pages_CommandersQuery",
    "selections": [
      {
        "alias": null,
        "args": (v6/*: any*/),
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
                            "variableName": "minTournamentSize"
                          },
                          (v5/*: any*/)
                        ],
                        "kind": "ObjectValue",
                        "name": "filters"
                      }
                    ],
                    "concreteType": "CommanderStats",
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
        "key": "pages__commanders",
        "kind": "LinkedHandle",
        "name": "commanders"
      }
    ]
  },
  "params": {
    "id": "14745cc7afd103bd6a5ec872679047e4",
    "metadata": {},
    "name": "pages_CommandersQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "a1ee982ceaef8e5eb98991f6761fa30f";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
