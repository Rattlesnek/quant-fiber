import { Edge } from "reactflow";
import { NodeObject, NodeType, OnNodeDataChange } from "./Nodes/types";
import { BasicMathNodeData, BasicMathOp } from "./Nodes/BasicMathNode";
import { PeriodicFuncNodeData, PeriodicFuncOp } from "./Nodes/PeriodicFuncNode";

export const getDefaultNodeObjectBasedOnNodeType = ({
  nodeId,
  nodeType,
  position,
  onNodeDataChange,
}: {
  nodeType: NodeType;
  nodeId: number;
  position: { x: number; y: number };
  onNodeDataChange: OnNodeDataChange;
}): NodeObject => {
  switch (nodeType) {
    case NodeType.inputPosition:
    case NodeType.inputTime:
    case NodeType.outputFunc:
      return {
        id: `${nodeType}_${nodeId}`,
        type: nodeType,
        data: {},
        position,
      };
    case NodeType.basicMath:
      return {
        id: `${nodeType}_${nodeId}`,
        type: nodeType,
        data: { operation: BasicMathOp.Add, onNodeDataChange },
        position,
      };
    case NodeType.periodicFunc:
      return {
        id: `${nodeType}_${nodeId}`,
        type: nodeType,
        data: { operation: PeriodicFuncOp.Sin, onNodeDataChange },
        position,
      };
  }
};

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
    } as BasicMathNodeData,
    position: { x: 100, y: 0 },
  },
  {
    id: "periodicFunc_1",
    type: NodeType.periodicFunc,
    data: {
      operation: PeriodicFuncOp.Sin,
    } as PeriodicFuncNodeData,
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
    } as BasicMathNodeData,
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
