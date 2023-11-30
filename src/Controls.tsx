import { Button, Grid, Slider } from "@mui/material";
import { useWebRTC } from "./tabCommunication/useWebRTC";
import { RenderParamsWithDate } from "./types";
import { useRenderParamsState } from "./state/renderParamsState";
import { useState } from "react";

export const Controls: React.FC = () => {
  const [visualWindow, setVisualWindow] = useState<Window | null>(null);
  const { renderParams, setRenderParams } = useRenderParamsState();

  const { sendData, startConnection, closeConnection } =
    useWebRTC<RenderParamsWithDate>("webrtc");

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
    <>
      <Grid
        container
        spacing={5}
        paddingLeft={4}
        paddingRight={4}
        paddingTop={1}
        paddingBottom={1}
      >
        <Grid item xs={8}>
          <Slider
            min={-200}
            max={200}
            step={0.001}
            value={renderParams.xDomain}
            onChange={(_, value: number | number[]) => {
              if (!Array.isArray(value)) return;

              const newParams: RenderParamsWithDate = {
                ...renderParams,
                xDomain: value,
                time: new Date().getTime(),
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
    </>
  );
};
