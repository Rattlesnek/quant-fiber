import { Button, Grid } from "@mui/material";
import { useWebRTC } from "../../tabCommunication/useWebRTC";
import { useRenderParamsState } from "../../state/renderParamsState";
import { useState } from "react";
import { RangeSlider } from "../Slider/RangeSlider";
import { RenderParams } from "../../rendering/types";

export const RenderControls: React.FC = () => {
  const [visualWindow, setVisualWindow] = useState<Window | null>(null);
  const { renderParams, setRenderParams } = useRenderParamsState();

  const { sendData, startConnection, closeConnection } =
    useWebRTC<RenderParams>("webrtc");

  const isVisualWindowOpen = (): boolean =>
    !!visualWindow && !visualWindow.closed;
  const openVisualWindow = (): void => {
    if (isVisualWindowOpen()) {
      return;
    }

    const newVisualWindow = window.open("/visual");
    if (!newVisualWindow) {
      return;
    }

    newVisualWindow.onload = () => {
      // New visual window is fully loaded
      startConnection();

      // Add event only after load was completed
      newVisualWindow.onunload = () => {
        console.log("unloading");
        // Visual window is being unloaded
        closeConnection();
        setVisualWindow(null);
      };
    };

    setVisualWindow(newVisualWindow);
  };

  return (
    <Grid
      container
      spacing={5}
      paddingLeft={4}
      paddingRight={4}
      paddingTop={1}
      paddingBottom={1}
    >
      <Grid item xs={11}>
        <RangeSlider
          onValueChange={(value) => {
            const newParams: RenderParams = {
              ...renderParams,
              xDomain: value,
            };

            sendData(newParams);
            setRenderParams(newParams);
          }}
        />
      </Grid>
      <Grid item xs={1}>
        <Button
          variant="contained"
          disabled={isVisualWindowOpen()}
          onClick={openVisualWindow}
        >
          Open
        </Button>
      </Grid>
    </Grid>
  );
};
