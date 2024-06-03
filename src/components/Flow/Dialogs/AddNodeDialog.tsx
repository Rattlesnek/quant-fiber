import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { NodeType } from "../Nodes/types";
import { useState } from "react";

interface AddNodeDialogProps {
  isOpen: boolean;
  onClose: (shouldAddNode?: NodeType) => void;
}

export const AddNodeDialog: React.FC<AddNodeDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [nodeType, setNodeType] = useState(NodeType.inputPosition);

  return (
    <Dialog open={isOpen} onClose={() => onClose()}>
      <DialogTitle>Add Node</DialogTitle>
      <DialogContent>
        <Box component="div" sx={{ minWidth: 200 }}>
          <FormControl fullWidth>
            <Select
              size="small"
              value={nodeType}
              onChange={(e) => {
                setNodeType(e.target.value as NodeType);
              }}
            >
              <MenuItem value={NodeType.inputPosition}>Input Position</MenuItem>
              <MenuItem value={NodeType.inputTime}>Input Time</MenuItem>
              <MenuItem value={NodeType.basicMath}>Basic Math</MenuItem>
              <MenuItem value={NodeType.periodicFunc}>
                Periodic Function
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button variant="contained" onClick={() => onClose(nodeType)}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
