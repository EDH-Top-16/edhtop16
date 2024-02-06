/**
 * @generated SignedSource<<d46dba9e3030e1d9ecb497e2d61be3c3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type commanders_CommanderTableRow$data = {
  readonly colorID: string | null | undefined;
  readonly conversionRate: number | null | undefined;
  readonly count: number | null | undefined;
  readonly draws: number | null | undefined;
  readonly losses: number | null | undefined;
  readonly lossesBracket: number | null | undefined;
  readonly lossesSwiss: number | null | undefined;
  readonly name: string;
  readonly topCuts: number | null | undefined;
  readonly winRate: number | null | undefined;
  readonly winRateBracket: number | null | undefined;
  readonly winRateSwiss: number | null | undefined;
  readonly wins: number | null | undefined;
  readonly winsBracket: number | null | undefined;
  readonly winsSwiss: number | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"commanders_CommanderTableRowMobileView">;
  readonly " $fragmentType": "commanders_CommanderTableRow";
};
export type commanders_CommanderTableRow$key = {
  readonly " $data"?: commanders_CommanderTableRow$data;
  readonly " $fragmentSpreads": FragmentRefs<"commanders_CommanderTableRow">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "commanders_CommanderTableRow",
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
      "name": "colorID",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "wins",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "winsSwiss",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "winsBracket",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "draws",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "losses",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "lossesSwiss",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "lossesBracket",
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
      "name": "winRate",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "winRateSwiss",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "winRateBracket",
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
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "commanders_CommanderTableRowMobileView"
    }
  ],
  "type": "CommanderType",
  "abstractKey": null
};

(node as any).hash = "b7e52fa2cc75a21596c41cce6432e4aa";

export default node;
