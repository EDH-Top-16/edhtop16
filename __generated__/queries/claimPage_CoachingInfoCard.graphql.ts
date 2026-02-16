/**
 * @generated SignedSource<<8e67003b12b03bd3820134f19ce26f04>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type claimPage_CoachingInfoCard$data = {
  readonly coachingBio: string | null | undefined;
  readonly coachingBookingUrl: string | null | undefined;
  readonly coachingRatePerHour: number | null | undefined;
  readonly offersCoaching: boolean;
  readonly " $fragmentType": "claimPage_CoachingInfoCard";
};
export type claimPage_CoachingInfoCard$key = {
  readonly " $data"?: claimPage_CoachingInfoCard$data;
  readonly " $fragmentSpreads": FragmentRefs<"claimPage_CoachingInfoCard">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "claimPage_CoachingInfoCard",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "offersCoaching",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "coachingBio",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "coachingBookingUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "coachingRatePerHour",
      "storageKey": null
    }
  ],
  "type": "Profile",
  "abstractKey": null
};

(node as any).hash = "2d0508ea92dba0b16db1198651165d66";

export default node;
