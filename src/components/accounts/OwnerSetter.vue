<template>
  <div class="field">
    <label class="label">Account address*</label>
    <div class="control">
      <input
        v-model="accountAddress"
        class="input is-black"
        type="text"
        placeholder="Public Key String e.g. GsbwXfJraMomNxBcjYLcG3mxkBUiyWXAB32fGbSMQRdW"
      />
    </div>
  </div>
  <div class="field">
    <label class="label">Current owner*</label>
    <div class="control">
      <input
        v-model="currentOwner"
        class="input is-black"
        type="text"
        placeholder="Secret (seed phrase or comma-separated array of 64 numbers)"
      />
    </div>
    <p class="help">
      Your secret is NOT saved NOR sent anywhere. It's only used to sign the
      owner change request fee.
    </p>
  </div>
  <div class="field">
    <label class="label">New owner*</label>
    <div class="control">
      <input
        v-model="newOwner"
        class="input is-black"
        type="text"
        placeholder="Public Key String e.g. GsbwXfJraMomNxBcjYLcG3mxkBUiyWXAB32fGbSMQRdW"
      />
    </div>
  </div>
  <div style="display: flex" class="control is-justify-content-center mt-5">
    <button
      :class="{ 'is-loading': settingOwner }"
      class="button is-black"
      @click="onSetOwner"
    >
      Set owner
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import accountComponents from "./accountComponents";
import { setTokenAccountOwner } from "@/solana/token";

export default defineComponent({
  name: accountComponents.SetOwner,
  emits: ["update:accountAddress"],
  props: {
    payerSecret: {
      type: String,
      required: true
    },
    tokenAddress: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const { payerSecret, tokenAddress } = toRefs(props);
    const settingOwner = ref(false);
    const accountAddress = ref("");
    const currentOwner = ref("");
    const newOwner = ref("");

    const onSetOwner = async () => {
      settingOwner.value = true;
      emit("update:accountAddress", "");
      try {
        await setTokenAccountOwner(
          payerSecret.value,
          tokenAddress.value,
          accountAddress.value,
          currentOwner.value,
          newOwner.value
        );
        emit("update:accountAddress", accountAddress.value);
      } catch (err) {
        settingOwner.value = false;
        throw err;
      }
      settingOwner.value = false;
    };

    return {
      settingOwner,
      accountAddress,
      onSetOwner,
      currentOwner,
      newOwner
    };
  }
});
</script>
