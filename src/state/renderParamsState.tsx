import { create } from "zustand";
import { RenderParams, defaultRenderParams } from "../rendering/types";

export type RenderParamsState = {
  renderParams: RenderParams;
  getRenderParams: () => RenderParams;
  setRenderParams: (renderParams: RenderParams) => void;
};

export const useRenderParamsState = create<RenderParamsState>((set, get) => ({
  renderParams: defaultRenderParams,
  getRenderParams: () => get().renderParams,
  setRenderParams: (renderParams) => set(() => ({ renderParams })),
}));
