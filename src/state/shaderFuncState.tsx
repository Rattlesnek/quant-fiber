import { create } from "zustand";
import { ShaderFunc, defaultShaderFunc } from "../rendering/types";

export type ShaderFuncState = {
  shaderFunc: ShaderFunc;
  getShaderFunc: () => ShaderFunc;
  setShaderFunc: (func: string) => void;
};

export const useShaderFuncState = create<ShaderFuncState>((set, get) => ({
  shaderFunc: defaultShaderFunc,
  getShaderFunc: () => get().shaderFunc,
  setShaderFunc: (func: string) =>
    set(() => ({ shaderFunc: { func, id: get().shaderFunc.id + 1 } })),
}));
