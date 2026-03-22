/**
 * @generated SignedSource<<9b7db591e6de4d2e947b491fd76af32b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page_TournamentBanner$data = {
  readonly bracketUrl: string;
  readonly name: string;
  readonly seatWinRatesByPhase: {
    readonly all: {
      readonly drawRate: number | null | undefined;
      readonly seat1: number | null | undefined;
      readonly seat2: number | null | undefined;
      readonly seat3: number | null | undefined;
      readonly seat4: number | null | undefined;
    };
    readonly finals: {
      readonly drawRate: number | null | undefined;
      readonly seat1: number | null | undefined;
      readonly seat2: number | null | undefined;
      readonly seat3: number | null | undefined;
      readonly seat4: number | null | undefined;
    };
    readonly swiss: {
      readonly drawRate: number | null | undefined;
      readonly seat1: number | null | undefined;
      readonly seat2: number | null | undefined;
      readonly seat3: number | null | undefined;
      readonly seat4: number | null | undefined;
    };
    readonly topCut: {
      readonly drawRate: number | null | undefined;
      readonly seat1: number | null | undefined;
      readonly seat2: number | null | undefined;
      readonly seat3: number | null | undefined;
      readonly seat4: number | null | undefined;
    };
  };
  readonly size: number;
  readonly topCut: number;
  readonly tournamentDate: string;
  readonly winner: ReadonlyArray<{
    readonly commander: {
      readonly cards: ReadonlyArray<{
        readonly imageUrls: ReadonlyArray<string>;
      }>;
    };
  }>;
  readonly " $fragmentType": "page_TournamentBanner";
};
export type page_TournamentBanner$key = {
  readonly " $data"?: page_TournamentBanner$data;
  readonly " $fragmentSpreads": FragmentRefs<"page_TournamentBanner">;
};

const node: ReaderFragment = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "seat1",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "seat2",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "seat3",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "seat4",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "drawRate",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "page_TournamentBanner",
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
      "name": "bracketUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "topCut",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "SeatWinRatesByPhase",
      "kind": "LinkedField",
      "name": "seatWinRatesByPhase",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "SeatWinRates",
          "kind": "LinkedField",
          "name": "all",
          "plural": false,
          "selections": (v0/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "SeatWinRates",
          "kind": "LinkedField",
          "name": "swiss",
          "plural": false,
          "selections": (v0/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "SeatWinRates",
          "kind": "LinkedField",
          "name": "topCut",
          "plural": false,
          "selections": (v0/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "SeatWinRates",
          "kind": "LinkedField",
          "name": "finals",
          "plural": false,
          "selections": (v0/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": "winner",
      "args": [
        {
          "kind": "Literal",
          "name": "maxStanding",
          "value": 1
        }
      ],
      "concreteType": "Entry",
      "kind": "LinkedField",
      "name": "entries",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Commander",
          "kind": "LinkedField",
          "name": "commander",
          "plural": false,
          "selections": [
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
      "storageKey": "entries(maxStanding:1)"
    }
  ],
  "type": "Tournament",
  "abstractKey": null
};
})();

(node as any).hash = "1e3828b7a2c1e4639ee26a2450a3b2b7";

export default node;
