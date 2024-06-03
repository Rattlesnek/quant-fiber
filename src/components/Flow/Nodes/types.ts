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
import {
  InputTimeNode,
  InputTimeNodeData,
  InputTimeNodeObject,
} from "./InputTimeNode";

export enum NodeType {
  inputPosition = "inputPosition",
  inputTime = "inputTime",
  outputFunc = "outputFunc",
  basicMath = "basicMath",
  periodicFunc = "periodicFunc",
}

export const nodeTypes: Record<NodeType, React.FC<NodeProps>> = {
  inputPosition: InputPositionNode,
  inputTime: InputTimeNode,
  outputFunc: OutputFuncNode,
  basicMath: BasicMathNode,
  periodicFunc: PeriodicFuncNode,
};

export type NodeObject =
  | InputPositionNodeObject
  | InputTimeNodeObject
  | OutputFuncNodeObject
  | BasicMathNodeObject
  | PeriodicFuncNodeObject;

export type NodeData =
  | InputPositionNodeData
  | InputTimeNodeData
  | OutputFuncNodeData
  | BasicMathNodeData
  | PeriodicFuncNodeData;

export type OnNodeDataChange = (nodeId: string, nodeData: NodeData) => void;

export type BaseNodeData = {
  onNodeDataChange: OnNodeDataChange;
};
