import { useFrame } from "@react-three/fiber";
import { basicVertex, carthesianFrag, carthesianFragNoFunc } from "../shaders";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useRenderParamsState } from "../../state/renderParamsState";
import { useShaderFuncState } from "../../state/shaderFuncState";

const clock = new THREE.Clock();

export const ShaderPlane = (): JSX.Element => {
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);

  const getRenderParams = useRenderParamsState(
    (state) => state.getRenderParams
  );

  const { shaderFunc } = useShaderFuncState();

  useEffect(() => {
    if (!shaderMaterialRef.current) return;

    console.log("newFunc");

    const fragmentShaderSrc = `${shaderFunc.func}\n${carthesianFragNoFunc}`;
    shaderMaterialRef.current.fragmentShader = fragmentShaderSrc;
    shaderMaterialRef.current.needsUpdate = true;
  }, [shaderFunc]);

  useFrame(() => {
    if (!shaderMaterialRef.current) return;

    shaderMaterialRef.current.uniforms.xDomain.value =
      getRenderParams().xDomain;

    const delta = clock.getDelta();
    shaderMaterialRef.current.uniforms.time.value += delta;
  });

  return (
    <mesh position={[0, 0, -10]}>
      <planeGeometry args={[100, 100]} />
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
