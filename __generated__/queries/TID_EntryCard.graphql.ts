/**
 * @generated SignedSource<<12d7a002c1c6d0ef0481fa7bc3f954d0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TID_EntryCard$data = {
  readonly commander: {
    readonly breakdownUrl: string | null | undefined;
    readonly cards: ReadonlyArray<{
      readonly imageUrls: ReadonlyArray<string> | null | undefined;
    }> | null | undefined;
    readonly name: string | null | undefined;
  } | null | undefined;
  readonly decklist: string | null | undefined;
  readonly draws: number | null | undefined;
  readonly losses: number | null | undefined;
  readonly player: {
    readonly isKnownCheater: boolean | null | undefined;
    readonly name: string | null | undefined;
  } | null | undefined;
  readonly standing: number | null | undefined;
  readonly wins: number | null | undefined;
  readonly " $fragmentType": "TID_EntryCard";
};
export type TID_EntryCard$key = {
  readonly " $data"?: TID_EntryCard$data;
  readonly " $fragmentSpreads": FragmentRefs<"TID_EntryCard">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TID_EntryCard",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "standing",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "wins",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "losses",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "draws",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "decklist",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Player",
      "kind": "LinkedField",
      "name": "player",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "isKnownCheater",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Commander",
      "kind": "LinkedField",
      "name": "commander",
      "plural": false,
      "selections": [
        (v0/*: any*/),
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
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Entry",
  "abstractKey": null
};
})();

(node as any).hash = "d1156d6019a54860009b45c2e88d9570";

export default node;
