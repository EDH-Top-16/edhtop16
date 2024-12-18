/**
 * @generated SignedSource<<55f61895840e1320ef88ac1b0d243a0f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Commander_CommanderPageFallbackQuery$variables = {
  commander: string;
};
export type Commander_CommanderPageFallbackQuery$data = {
  readonly commander: {
    readonly " $fragmentSpreads": FragmentRefs<"Commander_CommanderPageShell">;
  };
};
export type Commander_CommanderPageFallbackQuery = {
  response: Commander_CommanderPageFallbackQuery$data;
  variables: Commander_CommanderPageFallbackQuery$variables;
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
    "name": "Commander_CommanderPageFallbackQuery",
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
    "name": "Commander_CommanderPageFallbackQuery",
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
    "cacheID": "04f1bf3805643eb3db02a88e85fa6521",
    "id": null,
    "metadata": {},
    "name": "Commander_CommanderPageFallbackQuery",
    "operationKind": "query",
    "text": "query Commander_CommanderPageFallbackQuery(\n  $commander: String!\n) {\n  commander(name: $commander) {\n    ...Commander_CommanderPageShell\n    id\n  }\n}\n\nfragment Commander_CommanderBanner on Commander {\n  name\n  colorId\n  cards {\n    imageUrls\n    id\n  }\n}\n\nfragment Commander_CommanderMeta on Commander {\n  name\n}\n\nfragment Commander_CommanderPageShell on Commander {\n  ...Commander_CommanderBanner\n  ...Commander_CommanderMeta\n}\n"
  }
};
})();

(node as any).hash = "e103d336866ba6e9f98e3e977b739ba8";

export default node;
