/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type HomeRoot_home = {
    readonly cases: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly label: string;
                readonly name: string;
                readonly value: number;
            } | null;
        } | null> | null;
    };
    readonly " $refType": "HomeRoot_home";
};
export type HomeRoot_home$data = HomeRoot_home;
export type HomeRoot_home$key = {
    readonly " $data"?: HomeRoot_home$data;
    readonly " $fragmentRefs": FragmentRefs<"HomeRoot_home">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "HomeRoot_home",
  "type": "HomeData",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "cases",
      "storageKey": null,
      "args": null,
      "concreteType": "CasesConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "CasesEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Cases",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "label",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "name",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "value",
                  "args": null,
                  "storageKey": null
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = '3ba150a42ec51d7a1e350494919c234f';
export default node;
