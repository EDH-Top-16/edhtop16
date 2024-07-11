/**
 * @generated SignedSource<<4d0ddaee3028de2a0cbc32dfbdc586cf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EntrySortBy = "DATE" | "DRAWS" | "LOSSES" | "STANDING" | "WINRATE" | "WINS" | "%future added value";
export type SortDirection = "ASC" | "DESC" | "%future added value";
export type EntryFilters = {
  maxDate?: string | null | undefined;
  maxDraws?: number | null | undefined;
  maxLosses?: number | null | undefined;
  maxSize?: number | null | undefined;
  maxStanding?: number | null | undefined;
  maxWins?: number | null | undefined;
  minDate?: string | null | undefined;
  minDraws?: number | null | undefined;
  minLosses?: number | null | undefined;
  minSize?: number | null | undefined;
  minStanding?: number | null | undefined;
  minWins?: number | null | undefined;
};
export type Commander_CommanderQuery$variables = {
  commander: string;
  filters?: EntryFilters | null | undefined;
  sortBy?: EntrySortBy | null | undefined;
  sortDir?: SortDirection | null | undefined;
};
export type Commander_CommanderQuery$data = {
  readonly commander: {
    readonly entries: ReadonlyArray<{
      readonly " $fragmentSpreads": FragmentRefs<"Commander_EntryTableData">;
    }>;
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
  "name": "filters"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortBy"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortDir"
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
    "kind": "Variable",
    "name": "filters",
    "variableName": "filters"
  },
  {
    "kind": "Variable",
    "name": "sortBy",
    "variableName": "sortBy"
  },
  {
    "kind": "Variable",
    "name": "sortDir",
    "variableName": "sortDir"
  }
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  },
  (v6/*: any*/)
];
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
            "alias": null,
            "args": (v5/*: any*/),
            "concreteType": "Entry",
            "kind": "LinkedField",
            "name": "entries",
            "plural": true,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "Commander_EntryTableData"
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
      (v2/*: any*/),
      (v3/*: any*/),
      (v0/*: any*/)
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
          {
            "alias": null,
            "args": (v5/*: any*/),
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
                "selections": (v7/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Tournament",
                "kind": "LinkedField",
                "name": "tournament",
                "plural": false,
                "selections": (v7/*: any*/),
                "storageKey": null
              },
              (v6/*: any*/),
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
                "name": "winRate",
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
    "cacheID": "64432d1aa759a5afc4783e5e96aeb6de",
    "id": null,
    "metadata": {},
    "name": "Commander_CommanderQuery",
    "operationKind": "query",
    "text": "query Commander_CommanderQuery(\n  $filters: EntryFilters\n  $sortBy: EntrySortBy\n  $sortDir: SortDirection\n  $commander: String!\n) {\n  commander(name: $commander) {\n    entries(filters: $filters, sortBy: $sortBy, sortDir: $sortDir) {\n      ...Commander_EntryTableData\n      id\n    }\n    id\n  }\n}\n\nfragment Commander_EntryTableData on Entry {\n  player {\n    name\n    id\n  }\n  tournament {\n    name\n    id\n  }\n  id\n  decklist\n  standing\n  wins\n  losses\n  draws\n  winRate\n}\n"
  }
};
})();

(node as any).hash = "0952d49e84281e1cdc6e58ba8c81f347";

export default node;
