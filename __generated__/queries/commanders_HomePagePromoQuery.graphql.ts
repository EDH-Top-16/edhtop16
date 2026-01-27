/**
 * @generated SignedSource<<117835f737307add6424d5e97a6f9307>>
 * @relayHash 83b81295e9213739e28ffc542a328534
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 83b81295e9213739e28ffc542a328534

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type commanders_HomePagePromoQuery$variables = Record<PropertyKey, never>;
export type commanders_HomePagePromoQuery$data = {
  readonly homePagePromo: {
    readonly " $fragmentSpreads": FragmentRefs<"promo_EmbededPromo">;
  } | null | undefined;
};
export type commanders_HomePagePromoQuery = {
  response: commanders_HomePagePromoQuery$data;
  variables: commanders_HomePagePromoQuery$variables;
};

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "commanders_HomePagePromoQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "FirstPartyPromo",
        "kind": "LinkedField",
        "name": "homePagePromo",
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "commanders_HomePagePromoQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "FirstPartyPromo",
        "kind": "LinkedField",
        "name": "homePagePromo",
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
    "id": "83b81295e9213739e28ffc542a328534",
    "metadata": {},
    "name": "commanders_HomePagePromoQuery",
    "operationKind": "query",
    "text": null
  }
};

(node as any).hash = "ef6b6d4c8070fb4f2d7b01a01ce89e66";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
