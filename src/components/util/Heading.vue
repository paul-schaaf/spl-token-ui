<template>
  <div
    style="font-family: 'Racing Sans One', cursive; font-size:70px"
    class="has-text-black has-text-centered	"
  >
    {{ heading }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    heading: {
      type: String,
      required: true
    }
  }
});
</script>
