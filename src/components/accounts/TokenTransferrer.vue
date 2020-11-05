<template>
  <div class="field">
    <label class="label">Account owner*</label>
    <div class="control">
      <input
        v-model="ownerAccount"
        class="input is-black"
        type="text"
        placeholder="Secret (seed phrase or comma-separated array of 64 numbers)"
      />
    </div>
    <p class="help">
      Your secret is NOT saved NOR sent anywhere. It's only used to sign the
      token transfer request.
    </p>
  </div>
  <div class="field">
    <label class="label">Source account*</label>
    <div class="control">
      <input
        v-model="sourceAccount"
        class="input is-black"
        type="text"
        placeholder="Public Key String e.g. GsbwXfJraMomNxBcjYLcG3mxkBUiyWXAB32fGbSMQRdW"
      />
    </div>
  </div>
  <div class="field">
    <label class="label">Destination account*</label>
    <div class="control">
      <input
        v-model="destinationAccount"
        class="input is-black"
        type="text"
        placeholder="Public Key String e.g. GsbwXfJraMomNxBcjYLcG3mxkBUiyWXAB32fGbSMQRdW"
      />
    </div>
  </div>
  <div class="field">
    <label class="label">Amount*</label>
    <div class="control">
      <input
        v-model="tokenAmount"
        class="input is-black"
        type="text"
        placeholder="Tokens to send"
      />
    </div>
    <p class="help">
      Please be aware that a token is transferred using its smallest
      denomination e.g. if you have a token with 2 decimals and you type in 200
      you will transfer 2 tokens.
    </p>
  </div>
  <div style="display: flex" class="control is-justify-content-center mt-5">
    <button
      :class="{ 'is-loading': transferring }"
      class="button is-black"
      @click="onTransferTokens"
    >
      Transfer tokens
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import { transferTokens } from "@/solana/token";
import accountComponents from "./accountComponents";
import { u64 } from "@solana/spl-token";

export default defineComponent({
  name: accountComponents.Transfer,
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
    const ownerAccount = ref("");
    const destinationAccount = ref("");
    const sourceAccount = ref("");
    const transferring = ref(false);
    const tokenAmount = ref("");

    const onTransferTokens = async () => {
      transferring.value = true;
      emit("update:accountAddress", "");
      try {
        await transferTokens(
          payerSecret.value,
          tokenAddress.value,
          sourceAccount.value,
          destinationAccount.value,
          ownerAccount.value,
          new u64(tokenAmount.value, 10)
        );
        emit("update:accountAddress", destinationAccount.value);
      } catch (err) {
        transferring.value = false;
        throw err;
      }
      transferring.value = false;
    };

    return {
      destinationAccount,
      sourceAccount,
      transferring,
      onTransferTokens,
      tokenAmount,
      ownerAccount
    };
  }
});
</script>
