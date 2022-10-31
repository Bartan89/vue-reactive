<template>
  <div id="randomElement">A random element on page</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({});
</script>

<style scoped>
#randomElement {
  position: relative;
  padding: 10px;
  width: v-bind("`${Math.floor(Math.random() * 40 + 80)}px`");
  height: v-bind("`${Math.floor(Math.random() * 30 + 100)}px`");
  left: v-bind("`${Math.floor(Math.random() * 600 + 10)}px`");
  top: v-bind("`${Math.floor(Math.random() * 50 + 30)}px`");
  border: 1px solid black;
  border-radius: 5px;
  overflow: auto;
  background-color: aliceblue;
}
</style>
