export type RenderParams = {
  speed: number;
  xDomain: Array<number>;
  yDomain: Array<number>;
  range: Array<number>;
  circleInvRad: number;

  stop: boolean;
  reverse: boolean;
};

export type RenderParamsWithDate = RenderParams & { time: number };

export const defaultRenderParams: RenderParamsWithDate = {
  speed: 1.0,
  xDomain: [-10, 10],
  yDomain: [-10, 10],
  range: [-10, 10],
  circleInvRad: 1.0,
  stop: false,
  reverse: false,
  time: 0,
};
