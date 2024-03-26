import { Handle, NodeProps, Position } from "reactflow";
import { nodeStyles } from "./nodeStyles";

export type InputPositionNodeData = {};

export const InputPositionNode: React.FC<NodeProps> = () => {
  return (
    <div className={nodeStyles.node}>
      Input
      <Handle
        id="xPos"
        type="source"
        position={Position.Right}
        style={{ top: "10px" }}
      />
      <Handle
        id="yPos"
        type="source"
        position={Position.Right}
        style={{ top: "30px" }}
      />
    </div>
  );
};
