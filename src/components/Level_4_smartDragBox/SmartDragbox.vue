<template>
  <h1>{{ title }}</h1>
  <div class="red box">blue box</div>
  <div class="blue box">red box</div>
  <div class="box" @mousedown="startDrag($event)">Drag me</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { userStartedDrag$, state$ } from "./smartDragbox";
import { useObservable } from "@vueuse/rxjs";

export default defineComponent({
  props: {
    title: String,
  },
  data: () => ({
    value: useObservable(state$),
  }),
  methods: {
    startDrag: (event: MouseEvent) => {
      event.preventDefault();
      userStartedDrag$.next(event);
    },
  },
});
</script>

<style scoped>
.box {
  position: absolute;
  width: 100px;
  height: 100px;
  left: v-bind("`${value?.smartBox.x}px`");
  top: v-bind("`${value?.smartBox.y}px`");
  background-color: v-bind("`${value?.smartBox.color}`");
}

.red {
  left: v-bind("`${value?.box1.x}px`");
  top: v-bind("`${value?.box1.y}px`");
  background-color: v-bind("`${value?.box1.color}`");
}

.blue {
  left: v-bind("`${value?.box2.x}px`");
  top: v-bind("`${value?.box2.y}px`");
  background-color: v-bind("`${value?.box2.color}`");
}
</style>
