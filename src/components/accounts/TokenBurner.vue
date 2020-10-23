<template>
  <div class="field">
    <label class="label">Owner account*</label>
    <div class="control">
      <input
        v-model="ownerAccount"
        class="input is-black"
        type="text"
        placeholder="Secret Seed Phrase"
      />
    </div>
    <p class="help">
      Your secret phrase is NOT saved NOR sent anywhere. It's only used to sign
      the token transfer request.
    </p>
  </div>
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
      Please be aware that a token is burned using its smallest denomination
      e.g. if you have a token with 2 decimals and you type in 200 you will
      transfer 2 tokens.
    </p>
  </div>
  <div style="display: flex" class="control is-justify-content-center mt-5">
    <button
      :class="{ 'is-loading': burningTokens }"
      class="button is-black"
      @click="onBurnTokens"
    >
      Burn tokens
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import { burnTokens } from "@/solana/token";
import accountComponents from "./accountComponents";

export default defineComponent({
  name: accountComponents.Burn,
  props: {
    payerSeedPhrase: {
      type: String,
      required: true
    },
    tokenAddress: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const { payerSeedPhrase, tokenAddress } = toRefs(props);
    const ownerAccount = ref("");
    const accountAddress = ref("");
    const burningTokens = ref(false);
    const tokenAmount = ref(0);

    const onBurnTokens = async () => {
      burningTokens.value = true;
      emit("update:accountAddress", "");
      try {
        await burnTokens(
          payerSeedPhrase.value,
          tokenAddress.value,
          accountAddress.value,
          ownerAccount.value,
          tokenAmount.value
        );
        emit("update:accountAddress", accountAddress.value);
      } catch (err) {
        alert(err);
      }

      burningTokens.value = false;
    };

    return {
      burningTokens,
      tokenAmount,
      ownerAccount,
      accountAddress,
      onBurnTokens
    };
  }
});
</script>
