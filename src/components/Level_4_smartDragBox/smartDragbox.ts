import {
  exhaustMap,
  fromEvent,
  map,
  merge,
  scan,
  shareReplay,
  startWith,
  Subject,
  takeUntil,
} from "rxjs";

export const userStartedDrag$ = new Subject<MouseEvent>();

const obs$ = userStartedDrag$.pipe(
  exhaustMap((y) =>
    fromEvent<MouseEvent>(window, "mousemove").pipe(
      takeUntil(fromEvent(window, "mouseup")),
      map((e: MouseEvent) => ({
        x: e.clientX - y.offsetX,
        y: e.clientY - y.offsetY,
      }))
    )
  )
);

type State = {
  smartBox: { x: number; y: number; color: string };
  box1: { x: number; y: number; color: string };
  box2: { x: number; y: number; color: string };
};

const intialState: any = {
  smartBox: { x: 650, y: 250, color: "green" },
  box1: { x: 500, y: 500, color: "red" },
  box2: { x: 200, y: 400, color: "blue" },
};

const actions$ = merge(
  obs$.pipe(map((e) => ({ smartBox: { ...e, color: "green" } })))
);

export const state$ = actions$.pipe(
  startWith(intialState),
  scan(
    (state: State, command): State => ({
      ...state,
      ...command,
    })
  ),
  shareReplay(1),
  map((s) => {
    const d1 = Math.hypot(s.smartBox.y - s.box1.y, s.smartBox.x - s.box1.x);
    const d2 = Math.hypot(s.smartBox.y - s.box2.y, s.smartBox.x - s.box2.x);

    if (Math.min(d1, d2) > 200) {
      return { ...s };
    }

    if (d1 < d2) {
      return { ...s, smartBox: { ...s.smartBox, color: s.box1.color } };
    } else {
      return { ...s, smartBox: { ...s.smartBox, color: s.box2.color } };
    }
  })
);
