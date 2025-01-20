/**
 * @generated SignedSource<<3464c21da9362fcdbae1ac5c64a428c0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type staples_CommanderStaplesPageFallbackQuery$variables = {
  commander: string;
};
export type staples_CommanderStaplesPageFallbackQuery$data = {
  readonly commander: {
    readonly " $fragmentSpreads": FragmentRefs<"Commander_CommanderPageShell">;
  };
};
export type staples_CommanderStaplesPageFallbackQuery = {
  response: staples_CommanderStaplesPageFallbackQuery$data;
  variables: staples_CommanderStaplesPageFallbackQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "commander"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "commander"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "staples_CommanderStaplesPageFallbackQuery",
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
    "name": "staples_CommanderStaplesPageFallbackQuery",
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
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "breakdownUrl",
            "storageKey": null
          },
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
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "6468b2f2e8e0ab45d70d5ff49b23d781",
    "id": null,
    "metadata": {},
    "name": "staples_CommanderStaplesPageFallbackQuery",
    "operationKind": "query",
    "text": "query staples_CommanderStaplesPageFallbackQuery(\n  $commander: String!\n) {\n  commander(name: $commander) {\n    ...Commander_CommanderPageShell\n    id\n  }\n}\n\nfragment Commander_CommanderBanner on Commander {\n  name\n  colorId\n  cards {\n    imageUrls\n    id\n  }\n}\n\nfragment Commander_CommanderMeta on Commander {\n  name\n}\n\nfragment Commander_CommanderPageShell on Commander {\n  breakdownUrl\n  ...Commander_CommanderBanner\n  ...Commander_CommanderMeta\n}\n"
  }
};
})();

(node as any).hash = "567ce39ef6ea091f767cfa34a59ca166";

export default node;
