import { ShadeSlider, Wheel, hsvaToHex } from "@uiw/react-color";
import React, { useState } from "react";

interface ColorWheelProps {}

export const ColorWheel: React.FC<ColorWheelProps> = () => {
  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: 1 });
  return (
    <>
      <Wheel
        color={hsva}
        onChange={(color) => setHsva({ ...hsva, ...color.hsva })}
      />
      <ShadeSlider
        hsva={hsva}
        style={{ width: 210, marginTop: 20 }}
        onChange={(newShade) => {
          setHsva({ ...hsva, ...newShade });
        }}
      />
      {/* <div
        style={{
          width: "100%",
          height: 34,
          marginTop: 20,
          background: hsvaToHex(hsva),
        }}
      ></div> */}
    </>
  );
};
