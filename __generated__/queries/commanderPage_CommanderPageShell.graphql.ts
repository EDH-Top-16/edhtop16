/**
 * @generated SignedSource<<6f73e2d4a94c2a2af278cb29e83ecdd9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type commanderPage_CommanderPageShell$data = {
  readonly breakdownUrl: string;
  readonly filteredStats: {
    readonly conversionRate: number;
    readonly count: number;
    readonly metaShare: number;
    readonly topCutBias: number;
    readonly topCuts: number;
  };
  readonly name: string;
  readonly promo: {
    readonly " $fragmentSpreads": FragmentRefs<"promo_EmbededPromo">;
  } | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"commanderPage_CommanderBanner" | "commanderPage_CommanderMeta">;
  readonly " $fragmentType": "commanderPage_CommanderPageShell";
};
export type commanderPage_CommanderPageShell$key = {
  readonly " $data"?: commanderPage_CommanderPageShell$data;
  readonly " $fragmentSpreads": FragmentRefs<"commanderPage_CommanderPageShell">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "maxStanding"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "minEventSize"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "timePeriod"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "commanderPage_CommanderPageShell",
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
      "name": "commanderPage_CommanderBanner"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "commanderPage_CommanderMeta"
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "maxStanding",
          "variableName": "maxStanding"
        },
        {
          "kind": "Variable",
          "name": "minEventSize",
          "variableName": "minEventSize"
        },
        {
          "kind": "Variable",
          "name": "timePeriod",
          "variableName": "timePeriod"
        }
      ],
      "concreteType": "CommanderStats",
      "kind": "LinkedField",
      "name": "filteredStats",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "conversionRate",
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
          "name": "count",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "metaShare",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "topCutBias",
          "storageKey": null
        }
      ],
      "storageKey": null
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

(node as any).hash = "8c55791fb70a43c087f86d8ae6d8f16b";

export default node;
