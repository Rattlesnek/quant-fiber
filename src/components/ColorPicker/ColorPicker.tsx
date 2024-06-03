import React from "react";
import { ColorWheel } from "./ColorWheel";
import { ColorRange } from "./ColorRange";
import { Grid } from "@mui/material";

interface ColorPickerProps {}

export const ColorPicker: React.FC<ColorPickerProps> = () => {
  return (
    <Grid>
      <Grid item>
        <ColorWheel />
      </Grid>
      <Grid item>
        <ColorRange />
      </Grid>
    </Grid>
  );
};
