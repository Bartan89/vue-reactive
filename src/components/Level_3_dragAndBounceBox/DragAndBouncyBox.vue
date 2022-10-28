<template>
  <h1>{{ title }}</h1>
  <button @click="stopBounce()">stop</button>
  <div @mousedown="startDrag($event)" class="box">
    Drag me
    <button @click="bounceBox($event)">bounce</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  userStartedDrag$,
  boxMoves$,
  userClickedBounceBox$,
} from "./drag-and-bounce-box";
import { useObservable } from "@vueuse/rxjs";

export default defineComponent({
  props: {
    title: String,
  },
  components: {},
  data: () => ({
    value: useObservable(boxMoves$),
  }),
  methods: {
    startDrag: (event: MouseEvent) => {
      event.preventDefault();
      userStartedDrag$.next(event);
    },
    bounceBox: (event: MouseEvent) => {
      userClickedBounceBox$.next({
        go: "start",
        curPos: { x: event.clientX, y: event.clientY },
      });
    },
    stopBounce: () => {
      userClickedBounceBox$.next({ go: "halt", curPos: { x: 0, y: 0 } });
    },
  },
});
</script>

<style scoped>
.box {
  position: absolute;
  width: 100px;
  height: 100px;
  left: v-bind("`${value?.x}px`");
  top: v-bind("`${value?.y}px`");
  background-color: rgb(62, 128, 79);
}
</style>
