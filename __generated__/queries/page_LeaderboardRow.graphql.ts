/**
 * @generated SignedSource<<f4568f1a6ddc299eb34ae289b6e1e4f1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page_LeaderboardRow$data = {
  readonly drawRate: number;
  readonly draws: number;
  readonly player: {
    readonly name: string;
    readonly topdeckProfile: string | null | undefined;
  };
  readonly rank: number;
  readonly topCommanders: ReadonlyArray<{
    readonly name: string;
  }>;
  readonly " $fragmentType": "page_LeaderboardRow";
};
export type page_LeaderboardRow$key = {
  readonly " $data"?: page_LeaderboardRow$data;
  readonly " $fragmentSpreads": FragmentRefs<"page_LeaderboardRow">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "page_LeaderboardRow",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "rank",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "drawRate",
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
      "concreteType": "Player",
      "kind": "LinkedField",
      "name": "player",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "topdeckProfile",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Commander",
      "kind": "LinkedField",
      "name": "topCommanders",
      "plural": true,
      "selections": [
        (v0/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "LeaderboardEntry",
  "abstractKey": null
};
})();

(node as any).hash = "dc770ed4004d0377ddb13db2a746a2e9";

export default node;
