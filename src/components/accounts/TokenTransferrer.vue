<template>
  <div class="field">
    <label class="label">Token address*</label>
    <div class="control">
      <input
        v-model="tokenAddress"
        class="input is-black"
        type="text"
        placeholder="Token address e.g. 9rJcHifFVNmZed1KgAaRMmpRbnkaBgn5wZZcK1A6CDiC"
      />
    </div>
  </div>
  <div class="field">
    <label class="label">Owner account*</label>
    <div class="control">
      <input
        v-model="ownerAccount"
        class="input is-black"
        type="text"
        placeholder="Secret Seed Phase"
      />
    </div>
    <p class="help">
      Your secret phrase is NOT saved NOR sent anywhere. It's only used to sign
      the token transfer request.
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
        type="number"
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

export default defineComponent({
  name: accountComponents.Transfer,
  props: {
    payerSeedPhrase: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const { payerSeedPhrase } = toRefs(props);
    const tokenAddress = ref("");
    const ownerAccount = ref("");
    const destinationAccount = ref("");
    const sourceAccount = ref("");
    const transferring = ref(false);
    const tokenAmount = ref(0);

    const onTransferTokens = async () => {
      transferring.value = true;
      emit("update:accountAddress", "");
      try {
        await transferTokens(
          payerSeedPhrase.value,
          tokenAddress.value,
          sourceAccount.value,
          destinationAccount.value,
          ownerAccount.value,
          tokenAmount.value
        );
        emit("update:accountAddress", destinationAccount.value);
      } catch (err) {
        alert(err);
      }

      transferring.value = false;
    };

    return {
      tokenAddress,
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
