/**
 * @generated SignedSource<<537d5b10ddb3aca462203557ee7b6bcc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page__CoachingInfoCard$data = {
  readonly coachingBio: string | null | undefined;
  readonly coachingBookingUrl: string | null | undefined;
  readonly coachingRatePerHour: number | null | undefined;
  readonly offersCoaching: boolean;
  readonly " $fragmentType": "page__CoachingInfoCard";
};
export type page__CoachingInfoCard$key = {
  readonly " $data"?: page__CoachingInfoCard$data;
  readonly " $fragmentSpreads": FragmentRefs<"page__CoachingInfoCard">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "page__CoachingInfoCard",
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

(node as any).hash = "f9a6a93edf2208dc762b9ac4805d5419";

export default node;
