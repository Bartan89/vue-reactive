import {
  delay,
  exhaustMap,
  fromEvent,
  map,
  merge,
  scan,
  shareReplay,
  startWith,
  Subject,
  takeUntil,
  tap,
} from "rxjs";

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

export const userAddsBox$ = new Subject<State["boxes"][0]>();

const userAddedBox$ = userAddsBox$.pipe(
  map((e) => ({ action: "new-box", payload: e }))
);

type State = {
  tutorial: {
    x: number;
    y: number;
    width: number;
    height: number;
    content: string;
  };
  boxes: {
    x: number;
    y: number;
    width: number;
    height: number;
    content: string;
  }[];
};

const intialState: any = {
  tutorial: { x: 0, y: 320, color: "green" },
  boxes: [{ x: 0, y: 0, width: 0, height: 0, content: "start" }],
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
  payload: State["boxes"][0] | State["tutorial"];
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
          tutorial: { ...command.payload },
        };
      default:
        console.log("hi");
        return { ...state };
    }
  }, intialState),
  shareReplay(1),
  map((s) => {
    const y = s.tutorial.y;
    const x = s.tutorial.x;

    const XX = s.boxes
      .slice()
      .sort(
        (a, b) => Math.hypot(y - a.y, x - a.x) - Math.hypot(y - b.y, x - b.x)
      );
    console.log(XX);
    console.log("wroks?", XX[0].content);
    return {
      ...s,
      tutorial: { ...s.tutorial, content: XX[0].content },
      closest: XX[0],
    };
  })
);
