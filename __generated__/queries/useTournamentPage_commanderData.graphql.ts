/**
 * @generated SignedSource<<1d66131f3aefb18cfa167279a5483c37>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type useTournamentPage_commanderData$data = {
  readonly breakdownEntries?: ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"tournamentPage_EntryCard">;
  }>;
  readonly id: string;
  readonly " $fragmentType": "useTournamentPage_commanderData";
};
export type useTournamentPage_commanderData$key = {
  readonly " $data"?: useTournamentPage_commanderData$data;
  readonly " $fragmentSpreads": FragmentRefs<"useTournamentPage_commanderData">;
};

import useTournamentPageCommanderRefetchQuery_graphql from './useTournamentPageCommanderRefetchQuery.graphql';

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
      "name": "commander"
    },
    {
      "kind": "RootArgument",
      "name": "showBreakdownCommander"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "refetch": {
      "connection": null,
      "fragmentPathInResult": [
        "node"
      ],
      "operation": useTournamentPageCommanderRefetchQuery_graphql,
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "useTournamentPage_commanderData",
  "selections": [
    {
      "condition": "showBreakdownCommander",
      "kind": "Condition",
      "passingValue": true,
      "selections": [
        {
          "alias": "breakdownEntries",
          "args": [
            {
              "kind": "Variable",
              "name": "commander",
              "variableName": "commander"
            }
          ],
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
    (v0/*: any*/)
  ],
  "type": "Tournament",
  "abstractKey": null
};
})();

(node as any).hash = "1e54b4e38f1ed5f4e1ba03be008bfddc";

export default node;
