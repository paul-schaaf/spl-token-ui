<template>
  <div class="control">
    <input
      :value="address"
      class="input is-black"
      type="text"
      placeholder="Public Key String e.g. GsbwXfJraMomNxBcjYLcG3mxkBUiyWXAB32fGbSMQRdW"
      @input="$emit('update:address', $event.target.value)"
    />
  </div>
  <div class="help">
    <span v-if="derivePublicKey"
      ><span class="is-clickable has-text-underline" @click="onDerivePublicKey"
        ><strong>Derive public key from external wallet</strong></span
      >{{ hint }}</span
    >
  </div>
</template>

<script lang="ts">
import { useWallet } from "@/solana/externalWallet";
import { defineComponent } from "vue";
export default defineComponent({
  emits: ["update:address"],
  props: {
    address: {
      type: String,
      default: ""
    },
    derivePublicKey: {
      type: Boolean,
      default: false
    },
    hint: {
      type: String,
      default: ""
    }
  },
  setup(_, { emit }) {
    const onDerivePublicKey = async () => {
      const wallet = await useWallet();
      emit("update:address", wallet.publicKey.toBase58());
    };

    return { onDerivePublicKey };
  }
});
</script>
