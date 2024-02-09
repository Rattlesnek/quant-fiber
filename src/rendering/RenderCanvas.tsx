import React, { useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { css } from "@emotion/css";
import { ShaderPlane } from "./objects/ShaderPlane";
import { carthesianFrag, carthesianFragNoFunc } from "./shaders";
import { useShaderFuncState } from "../state/shaderFuncState";

interface RenderCanvasProps {}

export const RenderCanvas: React.FC<RenderCanvasProps> = ({}) => {
  return (
    <div className={styles.canvasContainer}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ShaderPlane />
      </Canvas>
    </div>
  );
};

const styles = {
  canvasContainer: css`
    position: absolute;
    width: 100%;
    height: 100%;
  `,
};
