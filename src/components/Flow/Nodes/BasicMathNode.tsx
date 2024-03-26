import { Handle, NodeProps, Position, useViewport } from "reactflow";
import { nodeStyles } from "./nodeStyles";
import { MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { css } from "@emotion/css";

export enum BasicMathOp {
  Add = "Add",
  Sub = "Sub",
  Mul = "Mul",
  Div = "Div",
}

export type BasicMathNodeData = {
  operation: BasicMathOp;
};

export const BasicMathNode: React.FC<NodeProps<BasicMathNodeData>> = ({
  data,
}) => {
  const [operation, setOperation] = useState<BasicMathOp>(BasicMathOp.Add);

  const { zoom } = useViewport();

  return (
    <div className={nodeStyles.node}>
      <div className={styles.nodeContent}>
        <Select
          className="nodrag"
          size="small"
          value={operation}
          onChange={(e) => {
            setOperation(e.target.value as BasicMathOp);
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

const styles = {
  nodeContent: css``,
};
