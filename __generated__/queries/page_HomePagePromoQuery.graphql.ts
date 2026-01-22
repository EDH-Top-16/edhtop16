/**
 * @generated SignedSource<<d115987977fdd6b477a93b6e499bf367>>
 * @relayHash 2accab97f1e628518929d5b5d9cd55d9
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 2accab97f1e628518929d5b5d9cd55d9

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
    "id": "2accab97f1e628518929d5b5d9cd55d9",
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
