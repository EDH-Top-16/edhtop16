/**
 * @generated SignedSource<<e16b1f7c35a3988f4cdb966d0f82421f>>
 * @relayHash 416e958e103c43a545826c193e2f8cce
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 416e958e103c43a545826c193e2f8cce

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page_HomePagePromoQuery$variables = Record<PropertyKey, never>;
export type page_HomePagePromoQuery$data = {
  readonly homePagePromo: {
    readonly " $fragmentSpreads": FragmentRefs<"promo_EmbededPromo">;
  } | null | undefined;
};
export type page_HomePagePromoQuery = {
  response: page_HomePagePromoQuery$data;
  variables: page_HomePagePromoQuery$variables;
};

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "page_HomePagePromoQuery",
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
    "name": "page_HomePagePromoQuery",
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
            "concreteType": "PromoRichContent",
            "kind": "LinkedField",
            "name": "richDescription",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "type",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "text",
                "storageKey": null
              }
            ],
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
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "buttonColor",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "416e958e103c43a545826c193e2f8cce",
    "metadata": {},
    "name": "page_HomePagePromoQuery",
    "operationKind": "query",
    "text": null
  }
};

(node as any).hash = "25271fce19092342b952e05782d02717";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
