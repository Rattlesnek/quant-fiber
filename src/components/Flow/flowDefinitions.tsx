import { Node, Edge } from "reactflow";

export const initialNodes: Node[] = [
  {
    id: "inputPosition_1",
    type: "inputPosition",
    data: {},
    position: { x: 0, y: 0 },
  },
  {
    id: "basicMath_1",
    type: "basicMath",
    data: {},
    position: { x: 100, y: 0 },
  },
  {
    id: "periodicFunc_1",
    type: "periodicFunc",
    data: {},
    position: { x: 200, y: 0 },
  },
  {
    id: "inputPosition_2",
    type: "inputPosition",
    data: {},
    position: { x: 200, y: -50 },
  },
  {
    id: "basicMath_2",
    type: "basicMath",
    data: {},
    position: { x: 300, y: 0 },
  },
  {
    id: "outputFunc",
    type: "outputFunc",
    data: {},
    position: { x: 400, y: 0 },
  },
];

export const initialEdges: Edge[] = [
  {
    id: "e-1",
    source: "inputPosition_1",
    sourceHandle: "xPos",
    target: "basicMath_1",
    targetHandle: "in1",
  },
  {
    id: "e-2",
    source: "inputPosition_1",
    sourceHandle: "yPos",
    target: "basicMath_1",
    targetHandle: "in2",
  },
  {
    id: "e-3",
    source: "basicMath_1",
    sourceHandle: "out",
    target: "periodicFunc_1",
    targetHandle: "in",
  },
  {
    id: "e-4",
    source: "periodicFunc_1",
    sourceHandle: "out",
    target: "basicMath_2",
    targetHandle: "in2",
  },
  {
    id: "e-5",
    source: "inputPosition_2",
    sourceHandle: "xPos",
    target: "basicMath_2",
    targetHandle: "in1",
  },
  {
    id: "e-6",
    source: "basicMath_2",
    sourceHandle: "out",
    target: "outputFunc",
    targetHandle: "in",
  },
];
