import { useFrame } from "@react-three/fiber";
import { basicVertex, carthesianFrag } from "../shaders";
import { ShaderMaterial } from "three";
import { useRef } from "react";
import { useRenderParamsState } from "../state/renderParamsState";

export const ShaderPlane = (): JSX.Element => {
  const shaderMaterialRef = useRef<ShaderMaterial>(null);

  const getRenderParams = useRenderParamsState(
    (state) => state.getRenderParams
  );

  useFrame(() => {
    if (!shaderMaterialRef.current) return;

    shaderMaterialRef.current.uniforms.xDomain.value =
      getRenderParams().xDomain;
  });

  return (
    <mesh position={[0, 0, -10]}>
      <planeGeometry args={[20, 20]} />
      <shaderMaterial
        ref={shaderMaterialRef}
        vertexShader={basicVertex}
        fragmentShader={carthesianFrag}
        uniforms={{
          time: {
            value: 1,
          },
          xDomain: {
            value: [-1, 10],
          },
          yDomain: {
            value: [-1, 10],
          },
          range: {
            value: [-3, 1],
          },
          circleInvRad: {
            value: 10,
          },
        }}
      />
    </mesh>
  );
};
