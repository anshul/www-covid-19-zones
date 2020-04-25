/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ZoneRoot_zoneStats = {
    readonly zone: {
        readonly code: string;
        readonly slug: string;
        readonly name: string;
        readonly parentZone: {
            readonly slug: string;
            readonly code: string;
            readonly name: string;
        } | null;
    };
    readonly totalCases: number;
    readonly asOf: string;
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
    readonly " $refType": "ZoneRoot_zoneStats";
};
export type ZoneRoot_zoneStats$data = ZoneRoot_zoneStats;
export type ZoneRoot_zoneStats$key = {
    readonly " $data"?: ZoneRoot_zoneStats$data;
    readonly " $fragmentRefs": FragmentRefs<"ZoneRoot_zoneStats">;
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
  "name": "ZoneRoot_zoneStats",
  "type": "ZoneStats",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "zone",
      "storageKey": null,
      "args": null,
      "concreteType": "Zone",
      "plural": false,
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
      "kind": "ScalarField",
      "alias": null,
      "name": "totalCases",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "asOf",
      "args": null,
      "storageKey": null
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
(node as any).hash = 'aa08efbe339d614735d40abe96def5a8';
export default node;
