/**
 * @generated SignedSource<<154df53cd6933cb88b24fa52a3c27d35>>
 * @relayHash e95628f921e60ae3206b88bef4cf3a92
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID e95628f921e60ae3206b88bef4cf3a92

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page_StaplesQuery$variables = {
  colorId?: string | null | undefined;
  type?: string | null | undefined;
};
export type page_StaplesQuery$data = {
  readonly staples: ReadonlyArray<{
    readonly id: string;
    readonly name: string | null | undefined;
    readonly playRateLastYear: number | null | undefined;
    readonly type: string | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"page_TypesSection">;
  }> | null | undefined;
};
export type page_StaplesQuery = {
  response: page_StaplesQuery$data;
  variables: page_StaplesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "colorId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "type"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "colorId",
    "variableName": "colorId"
  },
  {
    "kind": "Variable",
    "name": "type",
    "variableName": "type"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "playRateLastYear",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "page_StaplesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Card",
        "kind": "LinkedField",
        "name": "staples",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "page_TypesSection"
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
    "name": "page_StaplesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Card",
        "kind": "LinkedField",
        "name": "staples",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "manaCost",
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
            "args": null,
            "kind": "ScalarField",
            "name": "scryfallUrl",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "e95628f921e60ae3206b88bef4cf3a92",
    "metadata": {},
    "name": "page_StaplesQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "29f7c4160e8b012e34ef15482976e7d6";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
