/**
 * @generated SignedSource<<a5ad79fe121df92a5b998af390c2d327>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type claimPage_TeamCard$data = {
  readonly canCreateTeam: boolean;
  readonly ownedTeam: {
    readonly id: string;
    readonly invites: ReadonlyArray<{
      readonly joined: boolean;
      readonly name: string | null | undefined;
      readonly profileImage: string;
      readonly topdeckProfile: string;
      readonly username: string | null | undefined;
    }>;
    readonly name: string;
  } | null | undefined;
  readonly profile: {
    readonly selectableTeams: ReadonlyArray<{
      readonly id: string;
      readonly name: string;
    }>;
    readonly team: {
      readonly name: string;
    } | null | undefined;
    readonly topdeckProfile: string;
  } | null | undefined;
  readonly " $fragmentType": "claimPage_TeamCard";
};
export type claimPage_TeamCard$key = {
  readonly " $data"?: claimPage_TeamCard$data;
  readonly " $fragmentSpreads": FragmentRefs<"claimPage_TeamCard">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "topdeckProfile",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "claimPage_TeamCard",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "canCreateTeam",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Team",
      "kind": "LinkedField",
      "name": "ownedTeam",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "TeamMemberInvite",
          "kind": "LinkedField",
          "name": "invites",
          "plural": true,
          "selections": [
            (v2/*: any*/),
            (v1/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "username",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "profileImage",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "joined",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Profile",
      "kind": "LinkedField",
      "name": "profile",
      "plural": false,
      "selections": [
        (v2/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "Team",
          "kind": "LinkedField",
          "name": "selectableTeams",
          "plural": true,
          "selections": [
            (v0/*: any*/),
            (v1/*: any*/)
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Team",
          "kind": "LinkedField",
          "name": "team",
          "plural": false,
          "selections": [
            (v1/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Viewer",
  "abstractKey": null
};
})();

(node as any).hash = "36379cc4a9be6f4f88adc3a48412def9";

export default node;
