import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";
import { useState } from "react";

const Input = styled(MuiInput)`
  width: 62px;
`;

interface RangeSliderProps {
  initValue?: number[];
  initRange?: number[];
  onValueChange?: (value: number[]) => void;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  initValue = [-20, 20],
  initRange = [-100, 100],
  onValueChange,
}) => {
  const [range, setRange] = useState(initRange);
  const [value, setValue] = useState(initValue);

  const convertInputToNumber = (input: string): number => {
    return input === "" ? 0 : Number(input);
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item>
        <Input
          value={range[0]}
          size="small"
          onChange={(e) => {
            const minRange = convertInputToNumber(e.target.value);
            setRange((prev) => [minRange, prev[1]]);
          }}
          inputProps={{
            step: 10,
            type: "number",
          }}
        />
      </Grid>
      <Grid item xs>
        <Slider
          min={range[0]}
          max={range[1]}
          step={0.001}
          value={value}
          onChange={(_, newValue) => {
            setValue(newValue as number[]);
            onValueChange?.(newValue as number[]);
          }}
        />
      </Grid>
      <Grid item>
        <Input
          value={range[1]}
          size="small"
          onChange={(e) => {
            const maxRange = convertInputToNumber(e.target.value);
            setRange((prev) => [prev[0], maxRange]);
          }}
          inputProps={{
            step: 10,
            type: "number",
          }}
        />
      </Grid>
    </Grid>
  );
};
