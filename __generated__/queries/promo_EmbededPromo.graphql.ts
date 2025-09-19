/**
 * @generated SignedSource<<501ed2e4a285145f12b7a8760d3e418a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type promo_EmbededPromo$data = {
  readonly backgroundImageUrl: string | null | undefined;
  readonly buttonText: string | null | undefined;
  readonly description: ReadonlyArray<string> | null | undefined;
  readonly href: string | null | undefined;
  readonly imageUrl: string | null | undefined;
  readonly title: string | null | undefined;
  readonly " $fragmentType": "promo_EmbededPromo";
};
export type promo_EmbededPromo$key = {
  readonly " $data"?: promo_EmbededPromo$data;
  readonly " $fragmentSpreads": FragmentRefs<"promo_EmbededPromo">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
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
  "type": "FirstPartyPromo",
  "abstractKey": null
};

(node as any).hash = "a67a802bb9aaa73cec02386ee04000af";

export default node;
