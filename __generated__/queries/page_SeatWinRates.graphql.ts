/**
 * @generated SignedSource<<7674b12637a0e8a72104c98e7ce14210>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page_SeatWinRates$data = {
  readonly drawRate: number | null | undefined;
  readonly seat1: number | null | undefined;
  readonly seat2: number | null | undefined;
  readonly seat3: number | null | undefined;
  readonly seat4: number | null | undefined;
  readonly " $fragmentType": "page_SeatWinRates";
};
export type page_SeatWinRates$key = {
  readonly " $data"?: page_SeatWinRates$data;
  readonly " $fragmentSpreads": FragmentRefs<"page_SeatWinRates">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "page_SeatWinRates",
  "selections": [
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
  ],
  "type": "SeatWinRates",
  "abstractKey": null
};

(node as any).hash = "32f3bea72414c4362c82fa5bf896ccb6";

export default node;
