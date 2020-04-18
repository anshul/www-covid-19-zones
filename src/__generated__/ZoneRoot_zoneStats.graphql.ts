/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ZoneRoot_zoneStats = {
    readonly zone: {
        readonly slug: string;
    };
    readonly newCases: {
        readonly " $fragmentRefs": FragmentRefs<"CustomLineChart_chart">;
    };
    readonly " $refType": "ZoneRoot_zoneStats";
};
export type ZoneRoot_zoneStats$data = ZoneRoot_zoneStats;
export type ZoneRoot_zoneStats$key = {
    readonly " $data"?: ZoneRoot_zoneStats$data;
    readonly " $fragmentRefs": FragmentRefs<"ZoneRoot_zoneStats">;
};



const node: ReaderFragment = {
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
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "slug",
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
          "kind": "FragmentSpread",
          "name": "CustomLineChart_chart",
          "args": null
        }
      ]
    }
  ]
};
(node as any).hash = '4a3bc0e9637c0d96c9d53faec624b11d';
export default node;
