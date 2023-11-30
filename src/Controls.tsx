import { Button, Grid, Slider } from "@mui/material";
import { useWebRTC } from "./tabCommunication/useWebRTC";
import { RenderParamsWithDate } from "./types";
import { useRenderParamsState } from "./state/renderParamsState";

export const Controls: React.FC = () => {
  const { renderParams, setRenderParams } = useRenderParamsState();

  const { sendData, startConnection, closeConnection } =
    useWebRTC<RenderParamsWithDate>();

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
          <Button variant="contained" onClick={() => window.open("/visual")}>
            Open
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained" onClick={startConnection}>
            Start
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained" onClick={closeConnection}>
            Close
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
