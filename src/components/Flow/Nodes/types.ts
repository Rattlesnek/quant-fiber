import { NodeProps } from "reactflow";
import { BasicMathNode } from "./BasicMathNode";
import { InputPositionNode } from "./InputPositionNode";
import { OutputFuncNode } from "./OutputFuncNode";
import { PeriodicFuncNode } from "./PeriodicFuncNode";

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
