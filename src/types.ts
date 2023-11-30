export type Interval = {
  min: number;
  max: number;
};

export type RenderParams = {
  speed: number;
  domainX: Interval;
  domainY: Interval;
  range: Interval;
  circleInvRad: number;

  stop: boolean;
  reverse: boolean;
};

export type RenderParamsWithDate = RenderParams & { time: number };

export const defaultRenderParams: RenderParamsWithDate = {
  speed: 1.0,
  domainX: { min: -10, max: 10 },
  domainY: { min: -10, max: 10 },
  range: { min: 0, max: 10 },
  circleInvRad: 1.0,
  stop: false,
  reverse: false,
  time: 0,
};
