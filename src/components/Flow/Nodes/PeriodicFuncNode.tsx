import { Handle, Node, NodeProps, Position, useViewport } from "reactflow";
import { nodeStyles } from "./nodeStyles";
import { BaseNodeData, NodeType } from "./types";
import { MenuItem, Select } from "@mui/material";

export enum PeriodicFuncOp {
  Sin = "Sin",
  Cos = "Cos",
  Tan = "Tan",
}

export type PeriodicFuncNodeData = BaseNodeData & {
  operation: PeriodicFuncOp;
};

export type PeriodicFuncNodeObject = Node<
  PeriodicFuncNodeData,
  NodeType.periodicFunc
>;

export const PeriodicFuncNode: React.FC<NodeProps<PeriodicFuncNodeData>> = ({
  id,
  data,
}) => {
  const { zoom } = useViewport();

  return (
    <div className={nodeStyles.node}>
      <div>
        <Select
          className="nodrag"
          size="small"
          value={data.operation}
          onChange={(e) => {
            data.onNodeDataChange(id, {
              ...data,
              operation: e.target.value as PeriodicFuncOp,
            });
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                transform: `scale(${zoom}) !important`,
              },
            },
          }}
        >
          <MenuItem value={PeriodicFuncOp.Sin}>Sin</MenuItem>
          <MenuItem value={PeriodicFuncOp.Cos}>Cos</MenuItem>
          <MenuItem value={PeriodicFuncOp.Tan}>Tan</MenuItem>
        </Select>
      </div>
      <Handle id="in" type="target" position={Position.Left} />
      <Handle id="out" type="source" position={Position.Right} />
    </div>
  );
};
