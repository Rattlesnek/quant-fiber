import { Handle, NodeProps, Position } from "reactflow";
import { nodeStyles } from "./nodeStyles";
import { Grid, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { css } from "@emotion/css";

enum BasicMathOp {
  Add = "Add",
  Sub = "Sub",
  Mul = "Mul",
  Div = "Div",
}

export const BasicMathNode: React.FC<NodeProps> = () => {
  const [operation, setOperation] = useState<BasicMathOp>(BasicMathOp.Add);

  return (
    <div className={nodeStyles.node}>
      <div className={styles.nodeContent}>
        <Select
          value={operation}
          onChange={(e) => {
            setOperation(e.target.value as BasicMathOp);
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
  nodeContent: css`
    width: 30px;
    height: 20 px;
  `,
};
