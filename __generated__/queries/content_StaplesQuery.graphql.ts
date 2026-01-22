/**
 * @generated SignedSource<<3ca0e38b3030e8af5b6f6c9288e46ee9>>
 * @relayHash 0c89244ea09e14820e58b1aa36cef67a
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 0c89244ea09e14820e58b1aa36cef67a

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type content_StaplesQuery$variables = {
  colorId?: string | null | undefined;
  type?: string | null | undefined;
};
export type content_StaplesQuery$data = {
  readonly staples: ReadonlyArray<{
    readonly id: string;
    readonly name: string | null | undefined;
    readonly playRateLastYear: number | null | undefined;
    readonly type: string | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"content_TypesSection">;
  }> | null | undefined;
};
export type content_StaplesQuery = {
  response: content_StaplesQuery$data;
  variables: content_StaplesQuery$variables;
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
    "name": "content_StaplesQuery",
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
            "name": "content_TypesSection"
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
    "name": "content_StaplesQuery",
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
    "id": "0c89244ea09e14820e58b1aa36cef67a",
    "metadata": {},
    "name": "content_StaplesQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "a299fe82b3747706a6c280c852783ed4";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
