/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ZoneV2Root_data = {
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
        readonly asOf: string;
    }>;
    readonly cumCases: {
        readonly data: ReadonlyArray<unknown>;
        readonly lineKeys: ReadonlyArray<string>;
        readonly xAxisKey: string;
    };
    readonly newCases: {
        readonly data: ReadonlyArray<unknown>;
        readonly lineKeys: ReadonlyArray<string>;
        readonly xAxisKey: string;
    };
    readonly " $refType": "ZoneV2Root_data";
};
export type ZoneV2Root_data$data = ZoneV2Root_data;
export type ZoneV2Root_data$key = {
    readonly " $data"?: ZoneV2Root_data$data;
    readonly " $fragmentRefs": FragmentRefs<"ZoneV2Root_data">;
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
},
v3 = [
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
];
return {
  "kind": "Fragment",
  "name": "ZoneV2Root_data",
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
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "asOf",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "cumCases",
      "storageKey": null,
      "args": null,
      "concreteType": "LineChart",
      "plural": false,
      "selections": (v3/*: any*/)
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "newCases",
      "storageKey": null,
      "args": null,
      "concreteType": "LineChart",
      "plural": false,
      "selections": (v3/*: any*/)
    }
  ]
};
})();
(node as any).hash = '1acb89abb08cb48f99c422d3c927822d';
export default node;
