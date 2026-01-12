/**
 * @generated SignedSource<<cf5ea810400545fa0731b6d5964f0718>>
 * @relayHash b5e573e56ed72ecfa0d87227d650d672
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID b5e573e56ed72ecfa0d87227d650d672

import { ConcreteRequest } from 'relay-runtime';
export type coachingPage_CoachQuery$variables = {
  profile: string;
};
export type coachingPage_CoachQuery$data = {
  readonly coach: {
    readonly bestDecks: ReadonlyArray<{
      readonly colorId: string;
      readonly commander: {
        readonly cards: ReadonlyArray<{
          readonly imageUrls: ReadonlyArray<string>;
        }>;
      };
      readonly commanderName: string;
      readonly conversionRate: number;
      readonly draws: number;
      readonly losses: number;
      readonly topCuts: number;
      readonly winRate: number;
      readonly wins: number;
    }>;
    readonly coachingBio: string | null | undefined;
    readonly coachingBookingUrl: string | null | undefined;
    readonly coachingRatePerHour: number | null | undefined;
    readonly elo: number | null | undefined;
    readonly name: string;
    readonly profileImage: string | null | undefined;
    readonly topFinishes: ReadonlyArray<{
      readonly TID: string;
      readonly decklist: string | null | undefined;
      readonly draws: number;
      readonly losses: number;
      readonly standing: number;
      readonly tournamentDate: string;
      readonly tournamentName: string;
      readonly tournamentSize: number;
      readonly winRate: number;
      readonly wins: number;
    }>;
    readonly topdeckProfile: string | null | undefined;
  } | null | undefined;
};
export type coachingPage_CoachQuery = {
  response: coachingPage_CoachQuery$data;
  variables: coachingPage_CoachQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "profile"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "profile",
    "variableName": "profile"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "topdeckProfile",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "profileImage",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "elo",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "coachingBio",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "coachingBookingUrl",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "coachingRatePerHour",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "commanderName",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "colorId",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "wins",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "losses",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "draws",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "winRate",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "conversionRate",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "topCuts",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageUrls",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "concreteType": "PlayerFinish",
  "kind": "LinkedField",
  "name": "topFinishes",
  "plural": true,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "tournamentName",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "tournamentDate",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "tournamentSize",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "standing",
      "storageKey": null
    },
    (v11/*: any*/),
    (v12/*: any*/),
    (v13/*: any*/),
    (v14/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "TID",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "decklist",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v19 = {
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
    "name": "coachingPage_CoachQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Player",
        "kind": "LinkedField",
        "name": "coach",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "PlayerDeck",
            "kind": "LinkedField",
            "name": "bestDecks",
            "plural": true,
            "selections": [
              (v9/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              (v13/*: any*/),
              (v14/*: any*/),
              (v15/*: any*/),
              (v16/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Commander",
                "kind": "LinkedField",
                "name": "commander",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Card",
                    "kind": "LinkedField",
                    "name": "cards",
                    "plural": true,
                    "selections": [
                      (v17/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v18/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "coachingPage_CoachQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Player",
        "kind": "LinkedField",
        "name": "coach",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "PlayerDeck",
            "kind": "LinkedField",
            "name": "bestDecks",
            "plural": true,
            "selections": [
              (v9/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              (v13/*: any*/),
              (v14/*: any*/),
              (v15/*: any*/),
              (v16/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Commander",
                "kind": "LinkedField",
                "name": "commander",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Card",
                    "kind": "LinkedField",
                    "name": "cards",
                    "plural": true,
                    "selections": [
                      (v17/*: any*/),
                      (v19/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v19/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v18/*: any*/),
          (v19/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "b5e573e56ed72ecfa0d87227d650d672",
    "metadata": {},
    "name": "coachingPage_CoachQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "f702125c16cb7a6511d3b25bddf53719";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
