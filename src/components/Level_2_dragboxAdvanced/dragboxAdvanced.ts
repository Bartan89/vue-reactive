import {
  exhaustMap,
  fromEvent,
  map,
  merge,
  of,
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

const startPosition$ = of({
  x: window.innerWidth / 2 - 50,
  y: window.innerHeight / 2 - 50,
});

export const boxMoves$ = merge(startPosition$, obs$);
