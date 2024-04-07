import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { NodeType } from "../Nodes/types";

interface AddNodeDialogProps {
  isOpen: boolean;
  onClose: (shouldAddNode?: NodeType) => void;
}

export const AddNodeDialog: React.FC<AddNodeDialogProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onClose={() => onClose()}>
      <DialogTitle>Add Node</DialogTitle>
      <DialogContent>
        <Button
          variant="contained"
          onClick={() => onClose(NodeType.inputPosition)}
        >
          Add Input Position Node
        </Button>
        <Button variant="contained" onClick={() => onClose(NodeType.basicMath)}>
          Add Basic Math Node
        </Button>
        <Button
          variant="contained"
          onClick={() => onClose(NodeType.periodicFunc)}
        >
          Add Periodic Function Node
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
