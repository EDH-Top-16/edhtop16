/**
 * @generated SignedSource<<42f6f54976b32d83bff43c94a15b2278>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Commander_EntryCard$data = {
  readonly decklist: string | null | undefined;
  readonly draws: number | null | undefined;
  readonly losses: number | null | undefined;
  readonly player: {
    readonly isKnownCheater: boolean | null | undefined;
    readonly name: string | null | undefined;
  } | null | undefined;
  readonly standing: number | null | undefined;
  readonly tournament: {
    readonly TID: string | null | undefined;
    readonly name: string | null | undefined;
    readonly size: number | null | undefined;
    readonly tournamentDate: string | null | undefined;
  } | null | undefined;
  readonly wins: number | null | undefined;
  readonly " $fragmentType": "Commander_EntryCard";
};
export type Commander_EntryCard$key = {
  readonly " $data"?: Commander_EntryCard$data;
  readonly " $fragmentSpreads": FragmentRefs<"Commander_EntryCard">;
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
  "name": "Commander_EntryCard",
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

(node as any).hash = "d6479b58fdb921fe6bbd9325480b3c1b";

export default node;
