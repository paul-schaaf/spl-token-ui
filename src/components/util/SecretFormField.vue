<template>
  <p v-if="signExternally" class="has-text-centered" style="height: 2.5em">
    Sign using external wallet &check;
  </p>

  <div v-else style="display: flex" class="control">
    <input
      :value="secret"
      class="input is-black"
      type="text"
      placeholder="Your secret"
      @input="$emit('update:secret', $event.target.value)"
    />
  </div>
  <p class="help">
    <span v-if="signExternally"
      ><span class="is-clickable" @click="onToggleSignExternally"
        >Switch to manual input</span
      >{{ externalHint }}</span
    >
    <span v-else
      >{{ manualHint
      }}<span class="is-clickable" @click="onToggleSignExternally">
        <strong> Sign Externally</strong></span
      ></span
    >
  </p>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";
export default defineComponent({
  emits: ["update:secret", "update:signExternally"],
  props: {
    secret: {
      type: String,
      default: ""
    },
    manualHint: {
      type: String,
      default:
        "Check FAQ for valid secret types. Your secret is NOT saved NOR sent anywhere. It's only used to sign transactions locally."
    },
    externalHint: {
      type: String,
      default: ""
    },
    signExternally: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { emit }) {
    const { signExternally } = toRefs(props);
    const onToggleSignExternally = () => {
      emit("update:signExternally", !signExternally.value);
    };
    return { onToggleSignExternally };
  }
});
</script>
