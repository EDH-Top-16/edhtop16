/**
 * @generated SignedSource<<21aa331fd7a1196faf537b6574aa4bb9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type commanders_CommanderTableRow$data = {
  readonly colorId: string;
  readonly conversionRate: number;
  readonly count: number;
  readonly name: string;
  readonly topCuts: number;
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
      "name": "colorId",
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
  "type": "Commander",
  "abstractKey": null
};

(node as any).hash = "a5aa2523497bac85028009fee8fcf7b8";

export default node;
