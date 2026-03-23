/**
 * @generated SignedSource<<da1f9e2b266aee213133b26f2b1f5e62>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page_MonthlySeatWinRateRow$data = {
  readonly drawRate: number;
  readonly games: number;
  readonly month: string;
  readonly seatWinRate1: number;
  readonly seatWinRate2: number;
  readonly seatWinRate3: number;
  readonly seatWinRate4: number;
  readonly " $fragmentType": "page_MonthlySeatWinRateRow";
};
export type page_MonthlySeatWinRateRow$key = {
  readonly " $data"?: page_MonthlySeatWinRateRow$data;
  readonly " $fragmentSpreads": FragmentRefs<"page_MonthlySeatWinRateRow">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "page_MonthlySeatWinRateRow",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "month",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "games",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "seatWinRate1",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "seatWinRate2",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "seatWinRate3",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "seatWinRate4",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "drawRate",
      "storageKey": null
    }
  ],
  "type": "MonthlySeatWinRate",
  "abstractKey": null
};

(node as any).hash = "20474eaa468fc1aeb4b8d98a4902438f";

export default node;
