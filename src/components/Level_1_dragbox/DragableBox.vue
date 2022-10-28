<template>
  <h1>{{ title }}</h1>
  <div @mousedown="startDrag($event)" class="box">Drag me</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { userStartedDrag$, boxMoves$ } from "./drag-box";
import { useObservable } from "@vueuse/rxjs";

export default defineComponent({
  props: {
    title: String,
  },
  data: () => ({
    value: useObservable(boxMoves$),
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
  left: v-bind("`${value?.x}px`");
  top: v-bind("`${value?.y}px`");
  background-color: rgb(62, 128, 79);
}
</style>
