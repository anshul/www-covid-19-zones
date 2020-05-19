/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ZoneCard_zone = {
    readonly code: string;
    readonly name: string;
    readonly fPopulation: string;
    readonly fPopulationYear: string;
    readonly perMillionInfections: number;
    readonly cumulativeInfections: number;
    readonly " $refType": "ZoneCard_zone";
};
export type ZoneCard_zone$data = ZoneCard_zone;
export type ZoneCard_zone$key = {
    readonly " $data"?: ZoneCard_zone$data;
    readonly " $fragmentRefs": FragmentRefs<"ZoneCard_zone">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ZoneCard_zone",
  "type": "V2Zone",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "code",
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
      "name": "fPopulation",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "fPopulationYear",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "perMillionInfections",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "cumulativeInfections",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '1d53983ae9400abb9a56e07588840873';
export default node;
