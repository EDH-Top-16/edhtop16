/**
 * @generated SignedSource<<f4d588f1edff60f83773f4e64b96ac52>>
 * @relayHash 32aadc8136065f85d656e193812d46fb
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 32aadc8136065f85d656e193812d46fb

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TimePeriod = "ALL_TIME" | "ONE_MONTH" | "ONE_YEAR" | "POST_BAN" | "SIX_MONTHS" | "THREE_MONTHS" | "%future added value";
export type TournamentSortBy = "DATE" | "PLAYERS" | "%future added value";
export type tournaments_TournamentsQuery$variables = {
  minSize?: number | null | undefined;
  sortBy?: TournamentSortBy | null | undefined;
  timePeriod?: TimePeriod | null | undefined;
};
export type tournaments_TournamentsQuery$data = {
  readonly tournamentPagePromo: {
    readonly " $fragmentSpreads": FragmentRefs<"promo_EmbededPromo">;
  } | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"tournaments_Tournaments">;
};
export type tournaments_TournamentsQuery = {
  response: tournaments_TournamentsQuery$data;
  variables: tournaments_TournamentsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": 0,
  "kind": "LocalArgument",
  "name": "minSize"
},
v1 = {
  "defaultValue": "DATE",
  "kind": "LocalArgument",
  "name": "sortBy"
},
v2 = {
  "defaultValue": "ALL_TIME",
  "kind": "LocalArgument",
  "name": "timePeriod"
},
v3 = [
  {
    "fields": [
      {
        "kind": "Variable",
        "name": "minSize",
        "variableName": "minSize"
      },
      {
        "kind": "Variable",
        "name": "timePeriod",
        "variableName": "timePeriod"
      }
    ],
    "kind": "ObjectValue",
    "name": "filters"
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  },
  {
    "kind": "Variable",
    "name": "sortBy",
    "variableName": "sortBy"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": {
      "throwOnFieldError": true
    },
    "name": "tournaments_TournamentsQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "tournaments_Tournaments"
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "FirstPartyPromo",
        "kind": "LinkedField",
        "name": "tournamentPagePromo",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "promo_EmbededPromo"
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
      (v2/*: any*/),
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "tournaments_TournamentsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "TournamentConnection",
        "kind": "LinkedField",
        "name": "tournaments",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "TournamentEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Tournament",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "TID",
                    "storageKey": null
                  },
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "size",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "tournamentDate",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "maxStanding",
                        "value": 1
                      }
                    ],
                    "concreteType": "Entry",
                    "kind": "LinkedField",
                    "name": "entries",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Player",
                        "kind": "LinkedField",
                        "name": "player",
                        "plural": false,
                        "selections": [
                          (v5/*: any*/),
                          (v4/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Commander",
                        "kind": "LinkedField",
                        "name": "commander",
                        "plural": false,
                        "selections": [
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
                              (v4/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v4/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v4/*: any*/)
                    ],
                    "storageKey": "entries(maxStanding:1)"
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
        "args": (v3/*: any*/),
        "filters": [
          "filters",
          "sortBy"
        ],
        "handle": "connection",
        "key": "tournaments__tournaments",
        "kind": "LinkedHandle",
        "name": "tournaments"
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "FirstPartyPromo",
        "kind": "LinkedField",
        "name": "tournamentPagePromo",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "title",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "description",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "buttonText",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "backgroundImageUrl",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "imageUrl",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "href",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "32aadc8136065f85d656e193812d46fb",
    "metadata": {},
    "name": "tournaments_TournamentsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "03e59d93acc0b0d16c534d39f0594850";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
