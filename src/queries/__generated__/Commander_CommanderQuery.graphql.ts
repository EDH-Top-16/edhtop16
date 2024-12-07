/**
 * @generated SignedSource<<a899d59ac5cf1e1bb66c4ed9d0d43e68>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EntriesSortBy = "NEW" | "TOP" | "%future added value";
export type Commander_CommanderQuery$variables = {
  commander: string;
  maxStanding?: number | null | undefined;
  minEventSize: number;
  sortBy: EntriesSortBy;
};
export type Commander_CommanderQuery$data = {
  readonly commander: {
    readonly entries: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly id: string;
          readonly " $fragmentSpreads": FragmentRefs<"Commander_EntryCard">;
        };
      }>;
    };
    readonly " $fragmentSpreads": FragmentRefs<"Commander_CommanderPageShell">;
  };
};
export type Commander_CommanderQuery = {
  response: Commander_CommanderQuery$data;
  variables: Commander_CommanderQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "commander"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "maxStanding"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minEventSize"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortBy"
},
v4 = [
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "commander"
  }
],
v5 = [
  {
    "fields": [
      {
        "kind": "Variable",
        "name": "maxStanding",
        "variableName": "maxStanding"
      },
      {
        "kind": "Variable",
        "name": "minEventSize",
        "variableName": "minEventSize"
      },
      {
        "kind": "Literal",
        "name": "timePeriod",
        "value": "SIX_MONTHS"
      }
    ],
    "kind": "ObjectValue",
    "name": "filters"
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 24
  },
  {
    "kind": "Variable",
    "name": "sortBy",
    "variableName": "sortBy"
  }
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = {
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
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "Commander_CommanderQuery",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "commander",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Commander_CommanderPageShell"
          },
          {
            "alias": null,
            "args": (v5/*: any*/),
            "concreteType": "CommanderEntriesConnection",
            "kind": "LinkedField",
            "name": "entries",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "CommanderEntriesConnectionEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Entry",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "Commander_EntryCard"
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
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v3/*: any*/),
      (v2/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "Commander_CommanderQuery",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "commander",
        "plural": false,
        "selections": [
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "imageUrls",
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
            "args": (v5/*: any*/),
            "concreteType": "CommanderEntriesConnection",
            "kind": "LinkedField",
            "name": "entries",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "CommanderEntriesConnectionEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Entry",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "standing",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "wins",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "losses",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "draws",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "decklist",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Player",
                        "kind": "LinkedField",
                        "name": "player",
                        "plural": false,
                        "selections": [
                          (v7/*: any*/),
                          (v6/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Tournament",
                        "kind": "LinkedField",
                        "name": "tournament",
                        "plural": false,
                        "selections": [
                          (v7/*: any*/),
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
                          (v6/*: any*/)
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
            "storageKey": null
          },
          (v6/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "4d00660ce600318210d0816692458b55",
    "id": null,
    "metadata": {},
    "name": "Commander_CommanderQuery",
    "operationKind": "query",
    "text": "query Commander_CommanderQuery(\n  $commander: String!\n  $sortBy: EntriesSortBy!\n  $minEventSize: Int!\n  $maxStanding: Int\n) {\n  commander(name: $commander) {\n    ...Commander_CommanderPageShell\n    entries(first: 24, sortBy: $sortBy, filters: {timePeriod: SIX_MONTHS, minEventSize: $minEventSize, maxStanding: $maxStanding}) {\n      edges {\n        node {\n          id\n          ...Commander_EntryCard\n        }\n      }\n    }\n    id\n  }\n}\n\nfragment Commander_CommanderBanner on Commander {\n  name\n  imageUrls\n  colorId\n}\n\nfragment Commander_CommanderMeta on Commander {\n  name\n}\n\nfragment Commander_CommanderPageShell on Commander {\n  ...Commander_CommanderBanner\n  ...Commander_CommanderMeta\n}\n\nfragment Commander_EntryCard on Entry {\n  standing\n  wins\n  losses\n  draws\n  decklist\n  player {\n    name\n    id\n  }\n  tournament {\n    name\n    size\n    tournamentDate\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "90d8451d70d1a74b2a39a6d67e2504cb";

export default node;
