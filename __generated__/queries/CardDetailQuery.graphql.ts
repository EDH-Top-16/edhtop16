/**
 * @generated SignedSource<<6ca8b49bb86777a6ba2baf98dd9c2330>>
 * @relayHash c5e4714328981ab1429af5cd8533c285
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID c5e4714328981ab1429af5cd8533c285

import { ConcreteRequest } from 'relay-runtime';
export type CardDetailQuery$variables = {
  card?: string | null | undefined;
  commander: string;
};
export type CardDetailQuery$data = {
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
export type CardDetailQuery = {
  response: CardDetailQuery$data;
  variables: CardDetailQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "card"
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
  "variableName": "card"
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
    "name": "CardDetailQuery",
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
              (v11/*: any*/)
            ],
            "storageKey": null
          },
          (v13/*: any*/)
        ],
        "storageKey": null
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
    "name": "CardDetailQuery",
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
    "id": "c5e4714328981ab1429af5cd8533c285",
    "metadata": {},
    "name": "CardDetailQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "cb78830e79116f84ad7c760a5a1aa1db";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
