<template>
  <span></span>
  <div class="box"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

type something = {
  x: number;
  y: number;
  color: string;
};

export default defineComponent({
  props: {
    position: Object as PropType<something>,
  },
});
</script>

<style scoped>
.box {
  position: absolute;
  left: v-bind("`${position?.x}px`");
  top: v-bind("`${position?.y}px`");
  width: 30px;
  height: 30px;
  background-color: v-bind("`${position?.color}`");
}
</style>
