import {
  animationFrameScheduler,
  exhaustMap,
  fromEvent,
  interval,
  map,
  merge,
  repeat,
  Subject,
  switchMap,
  takeUntil,
  takeWhile,
} from "rxjs";

export const userStartedDrag$ = new Subject<MouseEvent>();
export const userClickedBounceBox$ = new Subject<{
  go: "start" | "halt";
  curPos: { x: number; y: number };
}>();

const boxMovesBasedOnDrag$ = userStartedDrag$.pipe(
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

const boxMovesBasedOnBounce$ = userClickedBounceBox$.pipe(
  repeat(),
  switchMap((y) => {
    console.log("again?");
    const startTime = Date.now();
    return interval(0, animationFrameScheduler).pipe(
      map((t) => t / 10),
      map((v) => Math.sin(v)),
      map(easeOutQuad),
      map((d) => d * 4),
      map((e) => ({
        y: -e + y.curPos.y - 30,
        x: y.curPos.x - 50,
      })),
      takeWhile(() => y.go !== "halt")
    );
  })
);

function easeOutQuad(x: number): number {
  return 1 - (1 - x) * (1 - x);
}

export const boxMoves$ = merge(boxMovesBasedOnDrag$, boxMovesBasedOnBounce$);
