import { Handle, NodeProps, Position } from "reactflow";
import { nodeStyles } from "./nodeStyles";

export const BasicMathNode: React.FC<NodeProps> = () => {
  return (
    <div className={nodeStyles.node}>
      Math
      <Handle
        id="in1"
        type="target"
        position={Position.Left}
        style={{ top: "10px" }}
      />
      <Handle
        id="in2"
        type="target"
        position={Position.Left}
        style={{ top: "30px" }}
      />
      <Handle id="out" type="source" position={Position.Right} />
    </div>
  );
};
