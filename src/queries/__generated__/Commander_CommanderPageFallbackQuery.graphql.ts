/**
 * @generated SignedSource<<b2905f282a0e849c6930e8174c878525>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TimePeriod = "ALL_TIME" | "ONE_MONTH" | "ONE_YEAR" | "POST_BAN" | "SIX_MONTHS" | "THREE_MONTHS" | "%future added value";
export type Commander_CommanderPageFallbackQuery$variables = {
  commander: string;
  minEventSize: number;
  timePeriod: TimePeriod;
};
export type Commander_CommanderPageFallbackQuery$data = {
  readonly commander: {
    readonly " $fragmentSpreads": FragmentRefs<"Commander_CommanderPageShell">;
  };
};
export type Commander_CommanderPageFallbackQuery = {
  response: Commander_CommanderPageFallbackQuery$data;
  variables: Commander_CommanderPageFallbackQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "commander"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minEventSize"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "timePeriod"
},
v3 = [
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "commander"
  }
],
v4 = {
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
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "Commander_CommanderPageFallbackQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "commander",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Commander_CommanderPageShell"
          }
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
      (v0/*: any*/),
      (v2/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "Commander_CommanderPageFallbackQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "commander",
        "plural": false,
        "selections": [
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
            "name": "name",
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
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": [
              {
                "fields": [
                  {
                    "kind": "Variable",
                    "name": "minSize",
                    "variableName": "minEventSize"
                  },
                  {
                    "kind": "Variable",
                    "name": "timePeriod",
                    "variableName": "timePeriod"
                  }
                ],
                "kind": "ObjectValue",
                "name": "filters"
              }
            ],
            "concreteType": "CommanderStats",
            "kind": "LinkedField",
            "name": "stats",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "conversionRate",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "metaShare",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "count",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "FirstPartyPromo",
            "kind": "LinkedField",
            "name": "promo",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "title",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "description",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "buttonText",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "backgroundImageUrl",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "imageUrl",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "href",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "6feb330076340a8d9cd3690f1324d431",
    "id": null,
    "metadata": {},
    "name": "Commander_CommanderPageFallbackQuery",
    "operationKind": "query",
    "text": "query Commander_CommanderPageFallbackQuery(\n  $commander: String!\n  $timePeriod: TimePeriod!\n  $minEventSize: Int!\n) {\n  commander(name: $commander) {\n    ...Commander_CommanderPageShell\n    id\n  }\n}\n\nfragment Commander_CommanderBanner on Commander {\n  name\n  colorId\n  cards {\n    imageUrls\n    id\n  }\n  stats(filters: {timePeriod: $timePeriod, minSize: $minEventSize}) {\n    conversionRate\n    metaShare\n    count\n  }\n}\n\nfragment Commander_CommanderMeta on Commander {\n  name\n}\n\nfragment Commander_CommanderPageShell on Commander {\n  breakdownUrl\n  ...Commander_CommanderBanner\n  ...Commander_CommanderMeta\n  promo {\n    ...promo_EmbededPromo\n  }\n}\n\nfragment promo_EmbededPromo on FirstPartyPromo {\n  title\n  description\n  buttonText\n  backgroundImageUrl\n  imageUrl\n  href\n}\n"
  }
};
})();

(node as any).hash = "41c1eeb8d7fbc59343c45c70f308aae8";

export default node;
