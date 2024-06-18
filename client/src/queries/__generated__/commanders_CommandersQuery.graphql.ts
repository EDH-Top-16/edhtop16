/**
 * @generated SignedSource<<c7f53eedf7fcf49f1642fe37bacd3c11>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CommanderSortBy = "CONVERSION" | "ENTRIES" | "NAME" | "TOP_CUTS" | "%future added value";
export type SortDirection = "ASC" | "DESC" | "%future added value";
export type Filters = {
  colorId?: string | null | undefined;
  maxDate?: string | null | undefined;
  maxEntries?: number | null | undefined;
  maxSize?: number | null | undefined;
  minDate?: string | null | undefined;
  minEntries?: number | null | undefined;
  minSize?: number | null | undefined;
  topCut?: number | null | undefined;
};
export type commanders_CommandersQuery$variables = {
  filters?: Filters | null | undefined;
  sortBy?: CommanderSortBy | null | undefined;
  sortDir?: SortDirection | null | undefined;
};
export type commanders_CommandersQuery$data = {
  readonly commanders: ReadonlyArray<{
    readonly " $fragmentSpreads": FragmentRefs<"commanders_CommandersTableData">;
  }>;
};
export type commanders_CommandersQuery = {
  response: commanders_CommandersQuery$data;
  variables: commanders_CommandersQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "filters"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "sortBy"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "sortDir"
  }
],
v1 = {
  "kind": "Variable",
  "name": "filters",
  "variableName": "filters"
},
v2 = [
  (v1/*: any*/),
  {
    "kind": "Variable",
    "name": "sortBy",
    "variableName": "sortBy"
  },
  {
    "kind": "Variable",
    "name": "sortDir",
    "variableName": "sortDir"
  }
],
v3 = [
  (v1/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "commanders_CommandersQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "commanders",
        "plural": true,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "commanders_CommandersTableData"
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "commanders_CommandersQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "commanders",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v3/*: any*/),
            "kind": "ScalarField",
            "name": "topCuts",
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v3/*: any*/),
            "kind": "ScalarField",
            "name": "count",
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v3/*: any*/),
            "kind": "ScalarField",
            "name": "conversionRate",
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
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "4aaa06a81735aac08c4f1f91873bc3ca",
    "id": null,
    "metadata": {},
    "name": "commanders_CommandersQuery",
    "operationKind": "query",
    "text": "query commanders_CommandersQuery(\n  $filters: Filters\n  $sortBy: CommanderSortBy\n  $sortDir: SortDirection\n) {\n  commanders(filters: $filters, sortBy: $sortBy, sortDir: $sortDir) {\n    ...commanders_CommandersTableData\n    id\n  }\n}\n\nfragment commanders_CommanderTableRow on Commander {\n  name\n  breakdownUrl\n  colorId\n  count(filters: $filters)\n  topCuts(filters: $filters)\n  conversionRate(filters: $filters)\n}\n\nfragment commanders_CommandersTableData on Commander {\n  name\n  topCuts(filters: $filters)\n  count(filters: $filters)\n  conversionRate(filters: $filters)\n  ...commanders_CommanderTableRow\n}\n"
  }
};
})();

(node as any).hash = "87806fefab79fcdec02c8527c44d0ea0";

export default node;
