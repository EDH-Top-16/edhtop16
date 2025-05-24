/**
 * @generated SignedSource<<00e942da89baa3b5a5217e64ec913be8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Commander_CommanderPromo$data = {
  readonly backgroundImageUrl: string;
  readonly buttonText: string;
  readonly description: ReadonlyArray<string>;
  readonly href: string;
  readonly imageUrl: string | null | undefined;
  readonly title: string;
  readonly " $fragmentType": "Commander_CommanderPromo";
};
export type Commander_CommanderPromo$key = {
  readonly " $data"?: Commander_CommanderPromo$data;
  readonly " $fragmentSpreads": FragmentRefs<"Commander_CommanderPromo">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Commander_CommanderPromo",
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
  "type": "CommanderPromo",
  "abstractKey": null
};

(node as any).hash = "b70e76c7e9132c08f9115856653fb48f";

export default node;
