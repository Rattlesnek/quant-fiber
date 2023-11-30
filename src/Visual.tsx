import { RenderCanvas } from "./RenderCanvas";
import { useRenderParamsState } from "./state/renderParamsState";
import { useWebRTC } from "./tabCommunication/useWebRTC";
import { RenderParamsWithDate } from "./types";

export const Visual: React.FC = () => {
  const setRenderParams = useRenderParamsState(
    (state) => state.setRenderParams
  );

  useWebRTC<RenderParamsWithDate>((receivedRenderParams) => {
    setRenderParams(receivedRenderParams);
  });

  return <RenderCanvas />;
};
