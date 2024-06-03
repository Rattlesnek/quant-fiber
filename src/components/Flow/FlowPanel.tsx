import { Button, Grid } from "@mui/material";
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
        <Grid
          container
          spacing={5}
          paddingLeft={4}
          paddingRight={4}
          paddingTop={1}
          paddingBottom={1}
        >
          <Grid item xs={1}>
            <Button
              variant="contained"
              onClick={() => setIsAddDialogOpen(true)}
            >
              Add Node
            </Button>
          </Grid>
          <Grid item xs={10}>
            <RenderControls />
          </Grid>
        </Grid>
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
