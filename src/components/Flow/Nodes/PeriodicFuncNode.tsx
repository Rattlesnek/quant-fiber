import { Handle, NodeProps, Position } from "reactflow";
import { nodeStyles } from "./nodeStyles";

export const PeriodicFuncNode: React.FC<NodeProps> = () => {
  return (
    <div className={nodeStyles.node}>
      Periodic
      <Handle id="in" type="target" position={Position.Left} />
      <Handle id="out" type="source" position={Position.Right} />
    </div>
  );
};
