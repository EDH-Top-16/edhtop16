/**
 * @generated SignedSource<<2ca559175f7f70a4d3f59c14232c5f55>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page_MonthlySeatWinRateChart$data = ReadonlyArray<{
  readonly drawRate: number;
  readonly month: string;
  readonly seatWinRate1: number;
  readonly seatWinRate2: number;
  readonly seatWinRate3: number;
  readonly seatWinRate4: number;
  readonly " $fragmentType": "page_MonthlySeatWinRateChart";
}>;
export type page_MonthlySeatWinRateChart$key = ReadonlyArray<{
  readonly " $data"?: page_MonthlySeatWinRateChart$data;
  readonly " $fragmentSpreads": FragmentRefs<"page_MonthlySeatWinRateChart">;
}>;

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true,
    "throwOnFieldError": true
  },
  "name": "page_MonthlySeatWinRateChart",
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

(node as any).hash = "ef5def670331c0c4c56455a6607f8a78";

export default node;
