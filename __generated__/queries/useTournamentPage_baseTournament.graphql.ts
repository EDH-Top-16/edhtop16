/**
 * @generated SignedSource<<a05c6e068b5af17c3c7fcc3dcae87208>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type useTournamentPage_baseTournament$data = {
  readonly breakdown?: ReadonlyArray<{
    readonly commander: {
      readonly id: string;
    };
    readonly " $fragmentSpreads": FragmentRefs<"tournamentPage_BreakdownGroupCard">;
  }>;
  readonly entries?: ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"tournamentPage_EntryCard">;
  }>;
  readonly id: string;
  readonly " $fragmentSpreads": FragmentRefs<"tournamentPage_TournamentPageShell">;
  readonly " $fragmentType": "useTournamentPage_baseTournament";
};
export type useTournamentPage_baseTournament$key = {
  readonly " $data"?: useTournamentPage_baseTournament$data;
  readonly " $fragmentSpreads": FragmentRefs<"useTournamentPage_baseTournament">;
};

import useTournamentPageBaseRefetchQuery_graphql from './useTournamentPageBaseRefetchQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "showBreakdown"
    },
    {
      "kind": "RootArgument",
      "name": "showStandings"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "refetch": {
      "connection": null,
      "fragmentPathInResult": [
        "node"
      ],
      "operation": useTournamentPageBaseRefetchQuery_graphql,
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "useTournamentPage_baseTournament",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "tournamentPage_TournamentPageShell"
    },
    {
      "condition": "showStandings",
      "kind": "Condition",
      "passingValue": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Entry",
          "kind": "LinkedField",
          "name": "entries",
          "plural": true,
          "selections": [
            (v0/*: any*/),
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "tournamentPage_EntryCard"
            }
          ],
          "storageKey": null
        }
      ]
    },
    {
      "condition": "showBreakdown",
      "kind": "Condition",
      "passingValue": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "TournamentBreakdownGroup",
          "kind": "LinkedField",
          "name": "breakdown",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Commander",
              "kind": "LinkedField",
              "name": "commander",
              "plural": false,
              "selections": [
                (v0/*: any*/)
              ],
              "storageKey": null
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "tournamentPage_BreakdownGroupCard"
            }
          ],
          "storageKey": null
        }
      ]
    },
    (v0/*: any*/)
  ],
  "type": "Tournament",
  "abstractKey": null
};
})();

(node as any).hash = "ebb89c738e2bfa6980c0606880be4f23";

export default node;
