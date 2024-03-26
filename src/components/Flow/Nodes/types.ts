import { Node, NodeProps } from "reactflow";
import { BasicMathNode, BasicMathNodeData } from "./BasicMathNode";
import { InputPositionNode, InputPositionNodeData } from "./InputPositionNode";
import { OutputFuncNode, OutputFuncNodeData } from "./OutputFuncNode";
import { PeriodicFuncNode, PeriodicFuncNodeData } from "./PeriodicFuncNode";

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
  | Node<BasicMathNodeData, NodeType.basicMath>
  | Node<InputPositionNodeData, NodeType.inputPosition>
  | Node<OutputFuncNodeData, NodeType.outputFunc>
  | Node<PeriodicFuncNodeData, NodeType.periodicFunc>;
