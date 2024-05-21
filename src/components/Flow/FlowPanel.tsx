import { Button } from "@mui/material";
import { useState } from "react";
import { Panel } from "reactflow";
import { AddNodeDialog } from "./Dialogs/AddNodeDialog";
import { NodeType } from "./Nodes/types";
import { RenderControls } from "../Controls/RenderControls";

interface FlowPanelProps {
  addNode: (nodeType: NodeType) => void;
}

export const FlowPanel: React.FC<FlowPanelProps> = ({ addNode }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <>
      <Panel position="top-left" style={{ width: "100%" }}>
        <RenderControls />;
        {/* <Button variant="contained" onClick={() => setIsAddDialogOpen(true)}>
          Add Node
        </Button> */}
      </Panel>
      <AddNodeDialog
        isOpen={isAddDialogOpen}
        onClose={(shouldAddNode) => {
          setIsAddDialogOpen(false);
          if (!shouldAddNode) {
            return;
          }
          addNode(shouldAddNode);
        }}
      />
    </>
  );
};
