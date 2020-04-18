/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CustomLineChart_chart = {
    readonly xAxisKey: string;
    readonly lineKeys: ReadonlyArray<string>;
    readonly data: ReadonlyArray<unknown>;
    readonly " $refType": "CustomLineChart_chart";
};
export type CustomLineChart_chart$data = CustomLineChart_chart;
export type CustomLineChart_chart$key = {
    readonly " $data"?: CustomLineChart_chart$data;
    readonly " $fragmentRefs": FragmentRefs<"CustomLineChart_chart">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "CustomLineChart_chart",
  "type": "LineChart",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "xAxisKey",
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
      "name": "data",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '419233452e2aa4c815267a854d0f54f8';
export default node;
