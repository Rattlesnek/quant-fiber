import { Handle, Node, NodeProps, Position } from "reactflow";
import { nodeStyles } from "./nodeStyles";
import { NodeType } from "./types";

export type OutputFuncNodeData = {};

export type OutputFuncNodeObject = Node<
  OutputFuncNodeData,
  NodeType.outputFunc
>;

export const OutputFuncNode: React.FC<NodeProps<OutputFuncNodeData>> = () => {
  return (
    <div className={nodeStyles.node}>
      Output
      <Handle id="in" type="target" position={Position.Left} />
    </div>
  );
};
