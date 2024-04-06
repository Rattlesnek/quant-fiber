import { NodeProps } from "reactflow";
import {
  BasicMathNode,
  BasicMathNodeData,
  BasicMathNodeObject,
} from "./BasicMathNode";
import {
  InputPositionNode,
  InputPositionNodeData,
  InputPositionNodeObject,
} from "./InputPositionNode";
import {
  OutputFuncNode,
  OutputFuncNodeData,
  OutputFuncNodeObject,
} from "./OutputFuncNode";
import {
  PeriodicFuncNode,
  PeriodicFuncNodeData,
  PeriodicFuncNodeObject,
} from "./PeriodicFuncNode";

export enum NodeType {
  inputPosition = "inputPosition",
  outputFunc = "outputFunc",
  basicMath = "basicMath",
  periodicFunc = "periodicFunc",
}

export const nodeTypes: Record<NodeType, React.FC<NodeProps>> = {
  inputPosition: InputPositionNode,
  outputFunc: OutputFuncNode,
  basicMath: BasicMathNode,
  periodicFunc: PeriodicFuncNode,
};

export type NodeObject =
  | InputPositionNodeObject
  | OutputFuncNodeObject
  | BasicMathNodeObject
  | PeriodicFuncNodeObject;

export type NodeData =
  | InputPositionNodeData
  | OutputFuncNodeData
  | BasicMathNodeData
  | PeriodicFuncNodeData;

export type OnNodeDataChange = (nodeId: string, nodeData: NodeData) => void;

export type BaseNodeData = {
  onNodeDataChange: OnNodeDataChange;
};
