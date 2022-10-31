<template>
  <h1>Level: {{ which }}</h1>
  <button @click="which === 0 ? null : which--">previous</button>
  <button @click="which === 7 ? null : which++">next</button>
  <DraggableBoxBasic v-if="which === 1" title="Draggable box" />
  <DraggableBoxAdvanced v-if="which === 2" title="Drag on any part" />
  <DragAndBounceBox v-if="which === 3" title="Draggable box that can bounce" />
  <smartDragBox v-if="which === 4" title="Smart box read context" />
  <ObjectAwareOfContext v-if="which === 5" title="Box aware of n objects" />
  <PuttingItAllTogether v-if="which === 6" title="Putting ideas together" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DraggableBoxBasic from "./components/Level_1_dragbox/DragableBox.vue";
import DraggableBoxAdvanced from "./components/Level_2_dragboxAdvanced/DragboxAdvanced.vue";
import DragAndBounceBox from "./components/Level_3_dragAndBounceBox/DragAndBouncyBox.vue";
import smartDragBox from "./components/Level_4_smartDragBox/SmartDragbox.vue";
import ObjectAwareOfContext from "./components/Level_5_objectAwareOfContext/ObjectAwareOfContext.vue";
import PuttingItAllTogether from "./components/level_6_puttingAllTogether/PuttingAllTogether.vue";
export default defineComponent({
  data: () => {
    return {
      which: 1,
    };
  },
  name: "App",
  components: {
    DraggableBoxBasic,
    DragAndBounceBox,
    DraggableBoxAdvanced,
    smartDragBox,
    ObjectAwareOfContext,
    PuttingItAllTogether,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
