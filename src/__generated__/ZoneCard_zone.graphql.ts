/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ZoneCard_zone = {
    readonly code: string;
    readonly name: string;
    readonly fEstPopulation: string;
    readonly fEstPopulationYear: string;
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
      "name": "fEstPopulation",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "fEstPopulationYear",
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
(node as any).hash = 'cdc6d8ba1cd3ebf78e334f428cc38854';
export default node;
