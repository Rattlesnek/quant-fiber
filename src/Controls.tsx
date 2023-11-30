import { Button, Grid, Slider } from "@mui/material";
import { useWebRTC } from "./tabCommunication/useWebRTC";
import { RenderParamsWithDate } from "./types";
import { useRenderParamsState } from "./state/renderParamsState";
import { useState } from "react";

export const Controls: React.FC = () => {
  const [visualWindow, setVisualWindow] = useState<Window | null>(null);
  const { renderParams, setRenderParams } = useRenderParamsState();

  const { sendData, startConnection } =
    useWebRTC<RenderParamsWithDate>("webrtc");

  const isVisualWindowOpen = () => !!visualWindow && !visualWindow.closed;

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
            value={[renderParams.domainX.min, renderParams.domainX.max]}
            onChange={(_, value: number | number[]) => {
              if (!Array.isArray(value)) return;

              const newParams = {
                ...renderParams,
                domainX: { min: value[0], max: value[1] },
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
            onClick={() => {
              if (isVisualWindowOpen()) {
                return;
              }

              const newVisualWindow = window.open("/visual");
              if (newVisualWindow) {
                newVisualWindow.addEventListener("load", () => {
                  // New visual window was fully loaded
                  startConnection();
                });
                setVisualWindow(newVisualWindow);
              }
            }}
          >
            Open
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
