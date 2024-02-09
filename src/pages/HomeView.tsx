import { css } from "@emotion/css";
import { RenderCanvas } from "../rendering/RenderCanvas";
import { UserControls } from "../components/UserControls";
import { FunctionFlow } from "../components/Flow/FunctionFlow";

export const HomeView: React.FC = () => {
  return (
    <>
      <div className={styles.controls}>
        <div>
          <UserControls />
        </div>
        <div>
          <FunctionFlow />
        </div>
      </div>
      <div className={styles.renderCanvas}>
        <RenderCanvas />
      </div>
    </>
  );
};

const styles = {
  controls: css`
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
  `,
  renderCanvas: css`
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
  `,
};
