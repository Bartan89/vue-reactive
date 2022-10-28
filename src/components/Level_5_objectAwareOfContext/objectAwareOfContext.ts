import {
  animationFrameScheduler,
  interval,
  map,
  merge,
  repeat,
  scan,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  takeWhile,
} from "rxjs";

export const userClickedGo$ = new Subject();

const obs$ = userClickedGo$.pipe(
  switchMap(() =>
    interval(0, animationFrameScheduler).pipe(
      map((e) => e * 3.5),
      takeWhile((e) => e < window.innerWidth),
      repeat({ delay: 200 }),
      map((e) => ({
        x: e,
        y: 320,
      }))
    )
  )
);

export const userAddsBox$ = new Subject<State["boxes"][0]>();

const userAddedBox$ = userAddsBox$.pipe(
  map((e) => ({ action: "new-box", payload: e }))
);

type State = {
  smartBox: { x: number; y: number; color: string };
  boxes: { x: number; y: number; color: string }[];
};

const intialState: any = {
  smartBox: { x: 0, y: 320, color: "green" },
  boxes: [
    { x: 650, y: 300, color: "purple" },
    { x: 200, y: 300, color: "yellow" },
  ],
};

const actions$ = merge(
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
  payload: State["boxes"][0] | State["smartBox"];
};

export const state$ = actions$.pipe(
  startWith(intialState),
  scan((state: State, command: XX): State => {
    switch (command.action) {
      case "new-box":
        console.log("hi");
        return { ...state, boxes: [...state.boxes, command.payload] };
      case "smart-box-moved":
        return {
          ...state,
          smartBox: { ...command.payload },
        };
      default:
        console.log("hi");
        return { ...state };
    }
  }, intialState),
  shareReplay(1),
  map((s) => {
    const y = s.smartBox.y;
    const x = s.smartBox.x;

    const XX = s.boxes
      .slice()
      .sort(
        (a, b) => Math.hypot(y - a.y, x - a.x) - Math.hypot(y - b.y, x - b.x)
      );
    return { ...s, smartBox: { ...s.smartBox, color: XX[0].color } };
  })
);
