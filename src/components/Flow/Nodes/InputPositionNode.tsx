import { Handle, Node, NodeProps, Position } from "reactflow";
import { nodeStyles } from "./nodeStyles";
import { NodeType } from "./types";
import { Typography } from "@mui/material";

export type InputPositionNodeData = Record<string, never>;

export type InputPositionNodeObject = Node<
  InputPositionNodeData,
  NodeType.inputPosition
>;

export const InputPositionNode: React.FC<
  NodeProps<InputPositionNodeData>
> = () => {
  return (
    <div className={nodeStyles.node}>
      <div
        style={{
          width: "45px",
          height: "22px",
          lineHeight: "22px",
        }}
      >
        <Typography>Pos</Typography>
      </div>
      <Handle
        id="xPos"
        type="source"
        position={Position.Right}
        style={{ top: "15px" }}
      >
        <div
          style={{
            position: "absolute",
            left: "-20px",
            top: "-8px",
            width: "20px",
            textAlign: "center",
          }}
        >
          <Typography variant="caption">x</Typography>
        </div>
      </Handle>
      <Handle
        id="yPos"
        type="source"
        position={Position.Right}
        style={{ top: "30px" }}
      >
        <div
          style={{
            position: "absolute",
            left: "-20px",
            top: "-8px",
            width: "20px",
            textAlign: "center",
          }}
        >
          <Typography variant="caption">y</Typography>
        </div>
      </Handle>
    </div>
  );
};
