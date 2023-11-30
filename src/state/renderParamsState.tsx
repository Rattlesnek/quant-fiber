import { create } from "zustand";
import { RenderParamsWithDate, defaultRenderParams } from "../types";

export type RenderParamsState = {
  renderParams: RenderParamsWithDate;
  getRenderParams: () => RenderParamsWithDate;
  setRenderParams: (renderParams: RenderParamsWithDate) => void;
};

export const useRenderParamsState = create<RenderParamsState>((set, get) => ({
  renderParams: defaultRenderParams,
  getRenderParams: () => get().renderParams,
  setRenderParams: (renderParams) => set(() => ({ renderParams })),
}));
