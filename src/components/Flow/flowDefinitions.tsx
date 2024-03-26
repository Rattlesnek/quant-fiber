import { Edge } from "reactflow";
import { NodeObject, NodeType } from "./Nodes/types";
import { BasicMathOp } from "./Nodes/BasicMathNode";

export const initialNodes: NodeObject[] = [
  {
    id: "inputPosition_1",
    type: NodeType.inputPosition,
    data: {},
    position: { x: 0, y: 0 },
  },
  {
    id: "basicMath_1",
    type: NodeType.basicMath,
    data: {
      operation: BasicMathOp.Add,
    },
    position: { x: 100, y: 0 },
  },
  {
    id: "periodicFunc_1",
    type: NodeType.periodicFunc,
    data: {
      operation: "asd",
    },
    position: { x: 200, y: 0 },
  },
  {
    id: "inputPosition_2",
    type: NodeType.inputPosition,
    data: {},
    position: { x: 200, y: -50 },
  },
  {
    id: "basicMath_2",
    type: NodeType.basicMath,
    data: {
      operation: BasicMathOp.Mul,
    },
    position: { x: 300, y: 0 },
  },
  {
    id: "outputFunc",
    type: NodeType.outputFunc,
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
