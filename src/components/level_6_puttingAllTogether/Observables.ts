import {
  animationFrameScheduler,
  concatMap,
  exhaustMap,
  fromEvent,
  interval,
  map,
  merge,
  scan,
  shareReplay,
  startWith,
  Subject,
  takeUntil,
  takeWhile,
  tap,
} from "rxjs";

export const userNexts$ = new Subject<{
  originX: number;
  originY: number;
  x: number;
  y: number;
}>();
export const userEntersBox$ = new Subject<number>();
export const userStartedDrag$ = new Subject<MouseEvent>();

const obs$ = userStartedDrag$.pipe(
  exhaustMap((y) =>
    fromEvent<MouseEvent>(window, "mousemove").pipe(
      tap(() => userEntersBox$.next(24)),
      takeUntil(fromEvent(window, "mouseup")),
      map((e: MouseEvent) => ({
        x: e.clientX - y.offsetX,
        y: e.clientY - y.offsetY,
      }))
    )
  )
);

const obs$2 = userNexts$.pipe(
  concatMap((g) => {
    const startTime = Date.now();
    return interval(0, animationFrameScheduler).pipe(
      map(() => Date.now() - startTime),
      map((t) => t / 500),
      map((x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)),
      takeWhile((t) => t < 1),
      map((t) => ({
        x: -t * (g.originX - g.x) + g.originX,
        y: -t * (g.originY - g.y) + g.originY,
      }))
    );
  }),
  map(({ x, y }) => ({ x, y }))
);

export const userAddsBox$ = new Subject<State["boxes"][0]>();

const userAddedBox$ = userAddsBox$.pipe(
  map((e) => ({ action: "new-box", payload: e }))
);

export type State = {
  tutorial: {
    x: number;
    y: number;
    width: number;
    height: number;
    content: number;
  };
  boxes: {
    x: number;
    y: number;
    width: number;
    height: number;
    content: number;
  }[];
};

const intialState: any = {
  tutorial: { x: 0, y: 320, color: "green" },
  boxes: [{ x: 0, y: 0, width: 0, height: 0, content: 66 }],
};

const actions$ = merge(
  obs$2.pipe(
    map((e) => ({
      action: "smart-box-moved",
      payload: e,
    }))
  ),
  obs$.pipe(
    map((e) => ({
      action: "smart-box-moved",
      payload: e,
    }))
  ),
  userAddedBox$
);

type XX = {
  action: "new-box" | "smart-box-moved";
  payload: State["boxes"][0] | State["tutorial"];
};

export const state$ = actions$.pipe(
  startWith(intialState),
  scan((state: State, command: XX): State => {
    switch (command.action) {
      case "new-box":
        return {
          ...state,
          boxes: [
            ...state.boxes.filter(
              (el) => el.content !== command.payload.content
            ),
            command.payload,
          ],
        };
      case "smart-box-moved":
        return {
          ...state,
          tutorial: { ...command.payload },
        };
      default:
        return { ...state };
    }
  }, intialState),
  shareReplay(1),
  map((s) => {
    const y = s.tutorial.y;
    const x = s.tutorial.x;

    const closestBoxToSmartOne = s.boxes
      .slice()
      .sort(
        (a, b) => Math.hypot(y - a.y, x - a.x) - Math.hypot(y - b.y, x - b.x)
      )[0];
    return {
      ...s,
      tutorial: { ...s.tutorial, content: closestBoxToSmartOne.content },
      closest: closestBoxToSmartOne,
    };
  })
);
