/**
 * @generated SignedSource<<ee128617812aa3e2f73e6d4f27e30d4b>>
 * @relayHash de9d93e20b54637603d0bd818c4d69ee
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID de9d93e20b54637603d0bd818c4d69ee

import { ConcreteRequest } from 'relay-runtime';
export type stapleDetails_CommanderStapleDetailsQuery$variables = {
  cardName: string;
  commander: string;
};
export type stapleDetails_CommanderStapleDetailsQuery$data = {
  readonly commander: {
    readonly cardDetail: {
      readonly cardPreviewImageUrl: string | null | undefined;
      readonly cmc: number;
      readonly colorId: string;
      readonly imageUrls: ReadonlyArray<string>;
      readonly name: string;
      readonly scryfallUrl: string;
      readonly type: string;
    } | null | undefined;
    readonly cardWinrateStats: {
      readonly withCard: {
        readonly conversionRate: number;
        readonly topCuts: number;
        readonly totalEntries: number;
      };
      readonly withoutCard: {
        readonly conversionRate: number;
        readonly topCuts: number;
        readonly totalEntries: number;
      };
    };
    readonly name: string;
  };
};
export type stapleDetails_CommanderStapleDetailsQuery = {
  response: stapleDetails_CommanderStapleDetailsQuery$data;
  variables: stapleDetails_CommanderStapleDetailsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "cardName"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "commander"
},
v2 = [
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "commander"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "kind": "Variable",
  "name": "cardName",
  "variableName": "cardName"
},
v5 = [
  (v4/*: any*/)
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cmc",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "colorId",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageUrls",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "scryfallUrl",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cardPreviewImageUrl",
  "storageKey": null
},
v12 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "totalEntries",
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
v13 = {
  "alias": null,
  "args": [
    (v4/*: any*/),
    {
      "kind": "Literal",
      "name": "timePeriod",
      "value": "THREE_MONTHS"
    }
  ],
  "concreteType": "CommanderCardWinrateStats",
  "kind": "LinkedField",
  "name": "cardWinrateStats",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "CommanderCardStats",
      "kind": "LinkedField",
      "name": "withCard",
      "plural": false,
      "selections": (v12/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "CommanderCardStats",
      "kind": "LinkedField",
      "name": "withoutCard",
      "plural": false,
      "selections": (v12/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": {
      "throwOnFieldError": true
    },
    "name": "stapleDetails_CommanderStapleDetailsQuery",
    "selections": [
      {
        "kind": "RequiredField",
        "field": {
          "alias": null,
          "args": (v2/*: any*/),
          "concreteType": "Commander",
          "kind": "LinkedField",
          "name": "commander",
          "plural": false,
          "selections": [
            (v3/*: any*/),
            {
              "alias": null,
              "args": (v5/*: any*/),
              "concreteType": "Card",
              "kind": "LinkedField",
              "name": "cardDetail",
              "plural": false,
              "selections": [
                (v3/*: any*/),
                (v6/*: any*/),
                (v7/*: any*/),
                (v8/*: any*/),
                (v9/*: any*/),
                (v10/*: any*/),
                (v11/*: any*/)
              ],
              "storageKey": null
            },
            (v13/*: any*/)
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
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "stapleDetails_CommanderStapleDetailsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "commander",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": (v5/*: any*/),
            "concreteType": "Card",
            "kind": "LinkedField",
            "name": "cardDetail",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v14/*: any*/)
            ],
            "storageKey": null
          },
          (v13/*: any*/),
          (v14/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "de9d93e20b54637603d0bd818c4d69ee",
    "metadata": {},
    "name": "stapleDetails_CommanderStapleDetailsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "55125f2aab79d5e7dde0c72fba65d88d";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
