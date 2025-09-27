/**
 * @generated SignedSource<<1e62771da06ab7f3ea98f43470430f11>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Commander_CardDetail$data = {
  readonly cardDetail: {
    readonly cardPreviewImageUrl: string | null | undefined;
    readonly cmc: number;
    readonly colorId: string;
    readonly imageUrls: ReadonlyArray<string>;
    readonly name: string;
    readonly scryfallUrl: string;
    readonly type: string;
  } | null | undefined;
  readonly cardWinrateStats: {
    readonly withCard: {
      readonly conversionRate: number;
      readonly topCuts: number;
      readonly totalEntries: number;
    };
    readonly withoutCard: {
      readonly conversionRate: number;
      readonly topCuts: number;
      readonly totalEntries: number;
    };
  };
  readonly name: string;
  readonly " $fragmentSpreads": FragmentRefs<"Commander_CardEntries">;
  readonly " $fragmentType": "Commander_CardDetail";
};
export type Commander_CardDetail$key = {
  readonly " $data"?: Commander_CardDetail$data;
  readonly " $fragmentSpreads": FragmentRefs<"Commander_CardDetail">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v1 = {
  "kind": "Variable",
  "name": "cardName",
  "variableName": "cardName"
},
v2 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "totalEntries",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "topCuts",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "conversionRate",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "cardName"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "Commander_CardDetail",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": [
        (v1/*: any*/)
      ],
      "concreteType": "Card",
      "kind": "LinkedField",
      "name": "cardDetail",
      "plural": false,
      "selections": [
        (v0/*: any*/),
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
          "name": "cmc",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "colorId",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "imageUrls",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "scryfallUrl",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "cardPreviewImageUrl",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        (v1/*: any*/),
        {
          "kind": "Literal",
          "name": "timePeriod",
          "value": "THREE_MONTHS"
        }
      ],
      "concreteType": "CommanderCardWinrateStats",
      "kind": "LinkedField",
      "name": "cardWinrateStats",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "CommanderCardStats",
          "kind": "LinkedField",
          "name": "withCard",
          "plural": false,
          "selections": (v2/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "CommanderCardStats",
          "kind": "LinkedField",
          "name": "withoutCard",
          "plural": false,
          "selections": (v2/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Commander_CardEntries"
    }
  ],
  "type": "Commander",
  "abstractKey": null
};
})();

(node as any).hash = "6fe20faa4abbacce36987b063b00b545";

export default node;
