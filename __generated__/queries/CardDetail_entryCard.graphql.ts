/**
 * @generated SignedSource<<9a1e40752cbc191dacee2e04e47075dd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CardDetail_entryCard$data = {
  readonly decklist: string | null | undefined;
  readonly draws: number;
  readonly losses: number;
  readonly player: {
    readonly isKnownCheater: boolean;
    readonly name: string;
  };
  readonly standing: number;
  readonly tournament: {
    readonly TID: string;
    readonly name: string;
    readonly size: number;
    readonly tournamentDate: string;
  };
  readonly wins: number;
  readonly " $fragmentType": "CardDetail_entryCard";
};
export type CardDetail_entryCard$key = {
  readonly " $data"?: CardDetail_entryCard$data;
  readonly " $fragmentSpreads": FragmentRefs<"CardDetail_entryCard">;
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
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "CardDetail_entryCard",
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
      "concreteType": "Tournament",
      "kind": "LinkedField",
      "name": "tournament",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "size",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "tournamentDate",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "TID",
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

(node as any).hash = "86b5c9ddb822daa618d3db2d9bf314bc";

export default node;
