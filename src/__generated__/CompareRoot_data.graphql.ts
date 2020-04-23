/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CompareRoot_data = {
    readonly zones: ReadonlyArray<{
        readonly code: string;
        readonly slug: string;
        readonly name: string;
        readonly parentZone: {
            readonly slug: string;
            readonly code: string;
            readonly name: string;
        } | null;
    }>;
    readonly totalCases: ReadonlyArray<{
        readonly zoneName: string;
        readonly count: number;
    }>;
    readonly newCases: {
        readonly data: ReadonlyArray<unknown>;
        readonly lineKeys: ReadonlyArray<string>;
        readonly xAxisKey: string;
    };
    readonly " $refType": "CompareRoot_data";
};
export type CompareRoot_data$data = CompareRoot_data;
export type CompareRoot_data$key = {
    readonly " $data"?: CompareRoot_data$data;
    readonly " $fragmentRefs": FragmentRefs<"CompareRoot_data">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "code",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "CompareRoot_data",
  "type": "CompareStats",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "zones",
      "storageKey": null,
      "args": null,
      "concreteType": "Zone",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
        (v2/*: any*/),
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "parentZone",
          "storageKey": null,
          "args": null,
          "concreteType": "Zone",
          "plural": false,
          "selections": [
            (v1/*: any*/),
            (v0/*: any*/),
            (v2/*: any*/)
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "totalCases",
      "storageKey": null,
      "args": null,
      "concreteType": "CaseCount",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "zoneName",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "count",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "newCases",
      "storageKey": null,
      "args": null,
      "concreteType": "LineChart",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "data",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "lineKeys",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "xAxisKey",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
})();
(node as any).hash = '8de8d48ceabf469f82bf12f9339be655';
export default node;
