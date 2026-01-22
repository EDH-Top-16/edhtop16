/**
 * @generated SignedSource<<51a1343ebe882cea23e21bfbba186256>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page_CommanderCardDetail$data = {
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
  readonly " $fragmentSpreads": FragmentRefs<"page_CommanderCardEntries">;
  readonly " $fragmentType": "page_CommanderCardDetail";
};
export type page_CommanderCardDetail$key = {
  readonly " $data"?: page_CommanderCardDetail$data;
  readonly " $fragmentSpreads": FragmentRefs<"page_CommanderCardDetail">;
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
  "variableName": "card"
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
      "name": "card"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "page_CommanderCardDetail",
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
      "name": "page_CommanderCardEntries"
    }
  ],
  "type": "Commander",
  "abstractKey": null
};
})();

(node as any).hash = "0e9c8c8d96920cb6d4b202342f80572b";

export default node;
