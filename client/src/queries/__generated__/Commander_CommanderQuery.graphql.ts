/**
 * @generated SignedSource<<c940c5b57c04631f3dbd9ccc576adac2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TopCommandersTopEntriesSortBy = "NEW" | "TOP" | "%future added value";
export type Commander_CommanderQuery$variables = {
  commander: string;
  sortBy: TopCommandersTopEntriesSortBy;
};
export type Commander_CommanderQuery$data = {
  readonly commander: {
    readonly topEntries: ReadonlyArray<{
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"Commander_EntryCard">;
    }>;
    readonly " $fragmentSpreads": FragmentRefs<"Commander_CommanderPageShell">;
  };
};
export type Commander_CommanderQuery = {
  response: Commander_CommanderQuery$data;
  variables: Commander_CommanderQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "commander"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "sortBy"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "commander"
  }
],
v2 = [
  {
    "kind": "Variable",
    "name": "sortBy",
    "variableName": "sortBy"
  },
  {
    "kind": "Literal",
    "name": "timePeriod",
    "value": "SIX_MONTHS"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "Commander_CommanderQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
            "args": (v2/*: any*/),
            "concreteType": "Entry",
            "kind": "LinkedField",
            "name": "topEntries",
            "plural": true,
            "selections": [
              (v3/*: any*/),
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
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "Commander_CommanderQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "commander",
        "plural": false,
        "selections": [
          (v4/*: any*/),
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
            "args": (v2/*: any*/),
            "concreteType": "Entry",
            "kind": "LinkedField",
            "name": "topEntries",
            "plural": true,
            "selections": [
              (v3/*: any*/),
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
                  (v4/*: any*/),
                  (v3/*: any*/)
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
                  (v4/*: any*/),
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
                  (v3/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "4262921cdbcb8514a6e563d6a13d6c20",
    "id": null,
    "metadata": {},
    "name": "Commander_CommanderQuery",
    "operationKind": "query",
    "text": "query Commander_CommanderQuery(\n  $commander: String!\n  $sortBy: TopCommandersTopEntriesSortBy!\n) {\n  commander(name: $commander) {\n    ...Commander_CommanderPageShell\n    topEntries(sortBy: $sortBy, timePeriod: SIX_MONTHS) {\n      id\n      ...Commander_EntryCard\n    }\n    id\n  }\n}\n\nfragment Commander_CommanderBanner on Commander {\n  name\n  imageUrls\n  colorId\n}\n\nfragment Commander_CommanderPageShell on Commander {\n  ...Commander_CommanderBanner\n}\n\nfragment Commander_EntryCard on Entry {\n  standing\n  wins\n  losses\n  draws\n  decklist\n  player {\n    name\n    id\n  }\n  tournament {\n    name\n    size\n    tournamentDate\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "6d66d39a41c7056661020c6e0d21f882";

export default node;
