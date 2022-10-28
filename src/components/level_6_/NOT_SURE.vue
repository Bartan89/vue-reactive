<template>
  <h1>{{ title }}</h1>
  <h1>is: {{ state?.tutorial.content }}</h1>
  <div class="highlighter"></div>
  <div
    @mousemove="tutorial($event, 'enter')"
    @mouseleave="tutorial($event, 'leave')"
    class="tutorial"
  >
    <div @mousedown="startDrag($event)" class="draggable">
      <button>&lt;</button> <button>></button>
    </div>
    <span>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae pariatur
      inventore natus libero possimus dolores ab quaerat officiis iure. Rerum
      reiciendis ea blanditiis explicabo quam possimus eligendi! Fuga, nam quas!
    </span>
  </div>
  <div class="border">
    <div class="header">
      <div tuttable="1" class="standardElement">A</div>
      <div class="standardElement">B</div>
      <div class="standardElement">C</div>
      <div tuttable="2" cable class="standardElement">D</div>
      <div class="standardElement">E</div>
    </div>
    <div class="sidebar">
      <div class="standardElement">A</div>
      <div class="standardElement">B</div>
      <div tuttable="5" class="standardElement">C</div>
      <div tuttable="4" class="standardElement">D</div>
      <div class="standardElement">E</div>
      <div tuttable="3" class="standardElement">F</div>
      <div class="standardElement">G</div>
    </div>
  </div>
</template>

<script lang="ts">
import { useObservable } from "@vueuse/rxjs";
import {
  animationFrameScheduler,
  debounceTime,
  delay,
  endWith,
  interval,
  map,
  scan,
  startWith,
  Subject,
  takeUntil,
  takeWhile,
  tap,
} from "rxjs";
import { defineComponent } from "vue";
import {
  userStartedDrag$,
  state$,
  userEntersBox$,
  userAddsBox$,
} from "./Observables";

const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x));
const clamp = (a: number, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const range = (x1: number, y1: number, x2: number, y2: number, a: number) =>
  lerp(x2, y2, invlerp(x1, y1, a));

export default defineComponent({
  props: {
    title: String,
  },
  mounted: () => {
    console.log("mounted");
    let obj = {};

    document.querySelectorAll("[tuttable]").forEach((el) => {
      console.log("hit?111");
      userAddsBox$.next({
        content: el.getAttribute("tuttable") as string,
        x: el.getBoundingClientRect().x,
        y: el.getBoundingClientRect().y,
        width: el.getBoundingClientRect().width,
        height: el.getBoundingClientRect().height,
      });
      // console.log(el.getAttribute("tuttable"), el.getBoundingClientRect());
    });
  },
  data: () => ({
    draging: false,
    value: useObservable(
      userEntersBox$.pipe(
        debounceTime(6),
        delay(180),
        map((e) => (e > 23 ? 23 : e)),
        startWith(0)
      )
    ),
    state: useObservable(state$),
  }),
  methods: {
    tutorial: (event: MouseEvent, state: "enter" | "leave") => {
      const close = lerp(28, -24, event.offsetY / 200);
      if (state === "enter") {
        if (close > 0) {
          userEntersBox$.next(close);
        }
      }

      if (state === "leave") {
        console.log("hit");
        userEntersBox$.next(0);
      }
    },
    startDrag: (event: MouseEvent) => {
      event.preventDefault();
      userStartedDrag$.next(event);
    },
  },
});
</script>

<style scoped>
.border {
  width: 90vw;
  height: 60vh;
  border: 1px solid black;
}

.header {
  width: 95%;
  height: 20%;
  border: 1px solid black;
  margin: 10px auto;
  padding: 5px;
  display: flex;
  flex-direction: row;
}

.sidebar {
  width: 15%;
  height: 70%;
  border: 1px solid black;
  margin: 10px 82.5% auto auto;
  display: flex;
  flex-direction: column;
}

.standardElement {
  position: relative;
  width: 70%;
  height: 20px;
  margin: auto auto 10px 10px;
  border: 0.5px solid black;
}

.highlighter {
  position: absolute;
  width: v-bind("state?.closest.width+'px'");
  height: v-bind("state?.closest.height+'px'");
  left: v-bind("state?.closest.x+'px'");
  top: v-bind("state?.closest.y+'px'");
  background-color: black;
}

.tutorial {
  position: absolute;
  top: v-bind("(state?.tutorial.y)+'px'");
  left: v-bind("(state?.tutorial.x)+'px'");
  width: 125px;
  height: 200px;
  margin: 0px;
  border: 1px solid black;
  background-color: whitesmoke;
  z-index: 999999;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: scroll;
  user-select: none;
}

button {
  border: none;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}
button:hover {
  border: none;
  background-color: rgb(106, 112, 128);
  color: rgb(255, 255, 255);
}

.draggable {
  position: relative;
  width: 100%;
  margin: 0px;
  padding: 0px;
  height: v-bind("(value**1.01)+'px'");
  overflow: hidden;
  background-color: rgb(123, 123, 123);
  cursor: grab;
  color: rgb(222, 222, 222);
}
</style>
