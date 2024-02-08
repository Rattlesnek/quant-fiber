import { Handle, NodeProps, Position } from "reactflow";
import { nodeStyles } from "./nodeStyles";

export const OutputFuncNode: React.FC<NodeProps> = () => {
  return (
    <div className={nodeStyles.node}>
      Output
      <Handle id="in" type="target" position={Position.Left} />
    </div>
  );
};
