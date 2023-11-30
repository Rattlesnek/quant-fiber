import { Controls } from "./Controls";
import { RenderCanvas } from "./RenderCanvas";

export const Home: React.FC = () => {
  return (
    <div>
      <Controls />
      <RenderCanvas />
    </div>
  );
};
