/**
 * @generated SignedSource<<00986b2c01a6683a0c6fdee470137a0a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page__TeamCard$data = {
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
  readonly " $fragmentType": "page__TeamCard";
};
export type page__TeamCard$key = {
  readonly " $data"?: page__TeamCard$data;
  readonly " $fragmentSpreads": FragmentRefs<"page__TeamCard">;
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
  "name": "page__TeamCard",
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

(node as any).hash = "3666c0b79f69ad2be2ca1f8ae65efee2";

export default node;
