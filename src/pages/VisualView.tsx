import { RenderCanvas } from "../rendering/RenderCanvas";
import { useRenderParamsState } from "../state/renderParamsState";
import { useWebRTC } from "../tabCommunication/useWebRTC";
import { RenderParams } from "../rendering/types";

export const VisualView: React.FC = () => {
  const setRenderParams = useRenderParamsState(
    (state) => state.setRenderParams
  );

  useWebRTC<RenderParams>("webrtc", (receivedRenderParams) => {
    setRenderParams(receivedRenderParams);
  });

  return <RenderCanvas />;
};
