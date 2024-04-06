import { Handle, Node, NodeProps, Position } from "reactflow";
import { nodeStyles } from "./nodeStyles";
import { BaseNodeData, NodeType } from "./types";

export type PeriodicFuncNodeData = BaseNodeData & {
  operation: string;
};

export type PeriodicFuncNodeObject = Node<
  PeriodicFuncNodeData,
  NodeType.periodicFunc
>;

export const PeriodicFuncNode: React.FC<NodeProps<PeriodicFuncNodeData>> = ({
  data,
}) => {
  return (
    <div className={nodeStyles.node}>
      Periodic
      <Handle id="in" type="target" position={Position.Left} />
      <Handle id="out" type="source" position={Position.Right} />
    </div>
  );
};
