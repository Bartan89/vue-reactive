import { exhaustMap, fromEvent, map, Subject, takeUntil } from "rxjs";

export const userStartedDrag$ = new Subject<MouseEvent>();

export const boxMoves$ = userStartedDrag$.pipe(
  exhaustMap(() =>
    fromEvent<MouseEvent>(window, "mousemove").pipe(
      takeUntil(fromEvent(window, "mouseup")),
      map((e: MouseEvent) => ({ x: e.clientX, y: e.clientY }))
    )
  )
);
