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
      token burn request.
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
        type="text"
        placeholder="Tokens to burn"
      />
    </div>
    <p class="help">
      Please be aware that a token is burned using its smallest denomination
      e.g. if you have a token with 2 decimals and you type in 200 you will burn
      2 tokens.
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
import { u64 } from "@solana/spl-token";

export default defineComponent({
  name: accountComponents.Burn,
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
    const accountAddress = ref("");
    const burningTokens = ref(false);
    const tokenAmount = ref("");

    const onBurnTokens = async () => {
      burningTokens.value = true;
      emit("update:accountAddress", "");
      try {
        await burnTokens(
          payerSecret.value,
          tokenAddress.value,
          accountAddress.value,
          ownerAccount.value,
          new u64(tokenAmount.value, 10)
        );
        emit("update:accountAddress", accountAddress.value);
      } catch (err) {
        burningTokens.value = false;
        throw err;
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
