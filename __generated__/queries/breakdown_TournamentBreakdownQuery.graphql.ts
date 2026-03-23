/**
 * @generated SignedSource<<998f552b18e70f95afa82c8aa062465b>>
 * @relayHash f9ea960b8b2cbfa76b41b5237a43c6d6
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID f9ea960b8b2cbfa76b41b5237a43c6d6

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type breakdown_TournamentBreakdownQuery$variables = {
  tid: string;
};
export type breakdown_TournamentBreakdownQuery$data = {
  readonly tournament: {
    readonly breakdown: ReadonlyArray<{
      readonly commander: {
        readonly id: string;
      };
      readonly " $fragmentSpreads": FragmentRefs<"breakdown_BreakdownGroupCard">;
    }>;
  };
};
export type breakdown_TournamentBreakdownQuery = {
  response: breakdown_TournamentBreakdownQuery$data;
  variables: breakdown_TournamentBreakdownQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "tid"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "TID",
    "variableName": "tid"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": {
      "throwOnFieldError": true
    },
    "name": "breakdown_TournamentBreakdownQuery",
    "selections": [
      {
        "kind": "RequiredField",
        "field": {
          "alias": null,
          "args": (v1/*: any*/),
          "concreteType": "Tournament",
          "kind": "LinkedField",
          "name": "tournament",
          "plural": false,
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
                    (v2/*: any*/)
                  ],
                  "storageKey": null
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "breakdown_BreakdownGroupCard"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        "action": "THROW"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "breakdown_TournamentBreakdownQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Tournament",
        "kind": "LinkedField",
        "name": "tournament",
        "plural": false,
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
                  (v2/*: any*/),
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
                    "name": "breakdownUrl",
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
                    "concreteType": "Card",
                    "kind": "LinkedField",
                    "name": "cards",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "imageUrls",
                        "storageKey": null
                      },
                      (v2/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "entries",
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
              }
            ],
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "f9ea960b8b2cbfa76b41b5237a43c6d6",
    "metadata": {},
    "name": "breakdown_TournamentBreakdownQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "18e4edf12fdc5243c4e827fb0821f72d";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
