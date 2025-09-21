/**
 * @generated SignedSource<<d9919129063b5f0d5156bf22817a162c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Commander_CommanderStats$data = {
  readonly stats: {
    readonly conversionRate: number;
    readonly count: number;
    readonly metaShare: number;
  };
  readonly " $fragmentType": "Commander_CommanderStats";
};
export type Commander_CommanderStats$key = {
  readonly " $data"?: Commander_CommanderStats$data;
  readonly " $fragmentSpreads": FragmentRefs<"Commander_CommanderStats">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "minEventSize"
    },
    {
      "kind": "RootArgument",
      "name": "timePeriod"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "Commander_CommanderStats",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "fields": [
            {
              "kind": "Variable",
              "name": "minSize",
              "variableName": "minEventSize"
            },
            {
              "kind": "Variable",
              "name": "timePeriod",
              "variableName": "timePeriod"
            }
          ],
          "kind": "ObjectValue",
          "name": "filters"
        }
      ],
      "concreteType": "CommanderCalculatedStats",
      "kind": "LinkedField",
      "name": "stats",
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
          "name": "metaShare",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "count",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Commander",
  "abstractKey": null
};

(node as any).hash = "f5341fd285b5b75033fa01699001ecd8";

export default node;
