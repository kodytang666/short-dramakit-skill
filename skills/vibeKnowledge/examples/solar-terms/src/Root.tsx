import { registerRoot, Composition } from "remotion";
import { Main } from "./compositions/Main";
import { MainV2 } from "./compositions/MainV2";
import { FPS, DURATION_SEC, WIDTH, HEIGHT } from "./script";
import { DURATION_SEC as DURATION_SEC_V2 } from "./script-v2";

registerRoot(() => (
  <>
    <Composition
      id="Main"
      component={Main}
      durationInFrames={Math.round(DURATION_SEC * FPS)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="MainV2"
      component={MainV2}
      durationInFrames={Math.round(DURATION_SEC_V2 * FPS)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
));
