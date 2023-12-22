import { RenderCanvas } from "../rendering/RenderCanvas";
import { useRenderParamsState } from "../state/renderParamsState";
import { useWebRTC } from "../tabCommunication/useWebRTC";
import { RenderParamsWithDate } from "../rendering/types";

export const VisualView: React.FC = () => {
  const setRenderParams = useRenderParamsState(
    (state) => state.setRenderParams
  );

  useWebRTC<RenderParamsWithDate>("webrtc", (receivedRenderParams) => {
    setRenderParams(receivedRenderParams);
  });

  return <RenderCanvas />;
};
