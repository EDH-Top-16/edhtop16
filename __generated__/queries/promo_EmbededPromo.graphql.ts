/**
 * @generated SignedSource<<c07151834c69e09a32bafe131ddd4d2e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type PromoButtonColor = "amber" | "teal" | "%future added value";
export type PromoContentType = "bold" | "normal" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type promo_EmbededPromo$data = {
  readonly backgroundImageUrl: string;
  readonly buttonColor: PromoButtonColor | null | undefined;
  readonly buttonText: string;
  readonly description: ReadonlyArray<string> | null | undefined;
  readonly href: string;
  readonly imageUrl: string | null | undefined;
  readonly richDescription: ReadonlyArray<{
    readonly text: string;
    readonly type: PromoContentType;
  }> | null | undefined;
  readonly title: string;
  readonly " $fragmentType": "promo_EmbededPromo";
};
export type promo_EmbededPromo$key = {
  readonly " $data"?: promo_EmbededPromo$data;
  readonly " $fragmentSpreads": FragmentRefs<"promo_EmbededPromo">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "promo_EmbededPromo",
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
  "type": "FirstPartyPromo",
  "abstractKey": null
};

(node as any).hash = "292366a576e94b0bff01f07ef751b507";

export default node;
