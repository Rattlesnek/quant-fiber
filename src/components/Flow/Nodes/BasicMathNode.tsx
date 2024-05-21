import { Handle, Node, NodeProps, Position, useViewport } from "reactflow";
import { nodeStyles } from "./nodeStyles";
import { MenuItem, Select } from "@mui/material";
import { css } from "@emotion/css";
import { BaseNodeData, NodeType } from "./types";

export enum BasicMathOp {
  Add = "Add",
  Sub = "Sub",
  Mul = "Mul",
  Div = "Div",
}

export type BasicMathNodeData = BaseNodeData & {
  operation: BasicMathOp;
};

export type BasicMathNodeObject = Node<BasicMathNodeData, NodeType.basicMath>;

export const BasicMathNode: React.FC<NodeProps<BasicMathNodeData>> = ({
  id,
  data,
}) => {
  console.log(data);

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
              operation: e.target.value as BasicMathOp,
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
          <MenuItem value={BasicMathOp.Add}>Add</MenuItem>
          <MenuItem value={BasicMathOp.Sub}>Sub</MenuItem>
          <MenuItem value={BasicMathOp.Mul}>Mul</MenuItem>
          <MenuItem value={BasicMathOp.Div}>Div</MenuItem>
        </Select>
      </div>
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
