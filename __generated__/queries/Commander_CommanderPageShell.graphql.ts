/**
 * @generated SignedSource<<df4d881516b7988f1a3843d27b70a451>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Commander_CommanderPageShell$data = {
  readonly breakdownUrl: string | null | undefined;
  readonly name: string | null | undefined;
  readonly promo: {
    readonly " $fragmentSpreads": FragmentRefs<"promo_EmbededPromo">;
  } | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"Commander_CommanderBanner" | "Commander_CommanderMeta">;
  readonly " $fragmentType": "Commander_CommanderPageShell";
};
export type Commander_CommanderPageShell$key = {
  readonly " $data"?: Commander_CommanderPageShell$data;
  readonly " $fragmentSpreads": FragmentRefs<"Commander_CommanderPageShell">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Commander_CommanderPageShell",
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
      "name": "breakdownUrl",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Commander_CommanderBanner"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Commander_CommanderMeta"
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "FirstPartyPromo",
      "kind": "LinkedField",
      "name": "promo",
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
  "type": "Commander",
  "abstractKey": null
};

(node as any).hash = "011cfed20ab1347f49689d7285e3d107";

export default node;
