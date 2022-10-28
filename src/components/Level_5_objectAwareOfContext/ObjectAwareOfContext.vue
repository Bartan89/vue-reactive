<template>
  <h1>{{ title }}</h1>
  <button @click="addBox()">Add box</button>
  <button @mousedown="go()">Go</button>
  <Box v-for="box in value?.boxes" :key="box.x" :position="box" />
  <div class="box"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { userClickedGo$, state$, userAddsBox$ } from "./objectAwareOfContext";
import { useObservable } from "@vueuse/rxjs";
import Box from "./someBox.vue";

export default defineComponent({
  props: {
    title: String,
  },
  components: {
    Box,
  },
  data: () => ({
    value: useObservable(state$),
  }),
  methods: {
    addBox: () => {
      userAddsBox$.next({
        x: Math.random() * window.innerWidth,
        y: 300,
        color: "#" + (((1 << 24) * Math.random()) | 0).toString(16),
      });
    },
    go: () => {
      userClickedGo$.next("");
    },
  },
});
</script>

<style scoped>
.box {
  position: absolute;
  width: 50px;
  height: 50px;
  left: v-bind("`${value?.smartBox.x}px`");
  top: v-bind("`${value?.smartBox.y}px`");
  background-color: v-bind("`${value?.smartBox.color}`");
}
</style>
