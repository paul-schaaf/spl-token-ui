<template>
  <div class="control">
    <input
      :input="secret"
      class="input is-black"
      type="text"
      placeholder="Secret (seed phrase or Ed25519 comma-separated array of 64 numbers)"
      @input="$emit('update:secret', $event.target.value)"
    />
  </div>
  <p class="help">
    {{ help }}
  </p>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    secret: {
      type: String,
      default: ""
    },
    help: {
      type: String,
      default:
        "Your secret is NOT saved NOR sent anywhere. It's only used to sign transactions locally."
    }
  }
});
</script>
