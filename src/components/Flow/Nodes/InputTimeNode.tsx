import { Handle, Node, NodeProps, Position } from "reactflow";
import { nodeStyles } from "./nodeStyles";
import { NodeType } from "./types";
import { Typography } from "@mui/material";

export type InputTimeNodeData = Record<string, never>;

export type InputTimeNodeObject = Node<InputTimeNodeData, NodeType.inputTime>;

export const InputTimeNode: React.FC<NodeProps<InputTimeNodeData>> = () => {
  return (
    <div className={nodeStyles.node}>
      <div
        style={{
          width: "40px",
          height: "22px",
          lineHeight: "22px",
        }}
      >
        <Typography>Time</Typography>
      </div>
      <Handle id="time" type="source" position={Position.Right} />
    </div>
  );
};
