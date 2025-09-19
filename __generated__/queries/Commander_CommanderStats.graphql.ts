/**
 * @generated SignedSource<<08ecef7c71458513bb35ba1d8aaab954>>
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
    readonly conversionRate: number | null | undefined;
    readonly count: number | null | undefined;
    readonly metaShare: number | null | undefined;
  } | null | undefined;
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
  "metadata": null,
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

(node as any).hash = "8191aab162228cbfa01a01d831c10e48";

export default node;
