import { Handle, Node, NodeProps, Position } from "reactflow";
import { nodeStyles } from "./nodeStyles";
import { NodeType } from "./types";
import { Typography } from "@mui/material";

export type OutputFuncNodeData = Record<string, never>;

export type OutputFuncNodeObject = Node<
  OutputFuncNodeData,
  NodeType.outputFunc
>;

export const OutputFuncNode: React.FC<NodeProps<OutputFuncNodeData>> = () => {
  return (
    <div className={nodeStyles.node}>
      <Typography>Output</Typography>
      <Handle id="in" type="target" position={Position.Left} />
    </div>
  );
};
