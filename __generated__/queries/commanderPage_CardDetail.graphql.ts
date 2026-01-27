/**
 * @generated SignedSource<<df4e91afcedf9f792bdd91cc7c65a696>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type commanderPage_CardDetail$data = {
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
  readonly " $fragmentSpreads": FragmentRefs<"commanderPage_CardEntries">;
  readonly " $fragmentType": "commanderPage_CardDetail";
};
export type commanderPage_CardDetail$key = {
  readonly " $data"?: commanderPage_CardDetail$data;
  readonly " $fragmentSpreads": FragmentRefs<"commanderPage_CardDetail">;
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
  "name": "commanderPage_CardDetail",
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
      "name": "commanderPage_CardEntries"
    }
  ],
  "type": "Commander",
  "abstractKey": null
};
})();

(node as any).hash = "0be140a8661cfbdc48364d1d19b4b199";

export default node;
