<template>
  <i
    :class="hasCopied ? 'fa-check-circle' : 'fa-copy'"
    class="far is-clickable"
    @click="onCopy"
  />
</template>

<script lang="ts">
import * as copyDefault from "copy-to-clipboard";
const copy = copyDefault.default;
import { defineComponent, toRefs, ref } from "vue";
export default defineComponent({
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  setup(props) {
    const { value } = toRefs(props);
    const hasCopied = ref(false);
    const onCopy = () => {
      copy(value.value);
      hasCopied.value = true;
      setTimeout(() => (hasCopied.value = false), 400);
    };
    return { onCopy, hasCopied };
  }
});
</script>
