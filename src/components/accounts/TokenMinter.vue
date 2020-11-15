<template>
  <div class="field">
    <label class="label">Mint authority*</label>
    <div class="control">
      <input
        v-model="mintAuthority"
        class="input is-black"
        type="text"
        placeholder="Secret (seed phrase or comma-separated array of 64 numbers)"
      />
    </div>
    <p class="help">
      Your secret is NOT saved NOR sent anywhere. It's only used to sign the
      token minting request.
    </p>
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
        placeholder="Token mint to mint e.g. 20000"
      />
    </div>
    <p class="help">
      Please be aware that a token is minted using its smallest denomination
      e.g. if you have a token with 2 decimals and you type in 200 you will mint
      2 tokens.
    </p>
  </div>
  <div style="display: flex" class="control is-justify-content-center mt-5">
    <button
      :class="{ 'is-loading': mintingToAccount }"
      class="button is-black"
      @click="mintToAccount"
    >
      Mint to account
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import { mintToken } from "@/solana/token";
import accountComponents from "./accountComponents";
import { u64 } from "@solana/spl-token";

export default defineComponent({
  name: accountComponents.Mint,
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
    const mintAuthority = ref("");
    const destinationAccount = ref("");
    const mintingToAccount = ref(false);
    const tokenAmount = ref("");

    const mintToAccount = async () => {
      mintingToAccount.value = true;
      emit("update:accountAddress", "");
      try {
        await mintToken(
          payerSecret.value,
          tokenAddress.value,
          mintAuthority.value,
          destinationAccount.value,
          new u64(tokenAmount.value, 10)
        );
        emit("update:accountAddress", destinationAccount.value);
      } catch (err) {
        mintingToAccount.value = false;
        throw err;
      }
      mintingToAccount.value = false;
    };

    return {
      destinationAccount,
      mintingToAccount,
      mintToAccount,
      mintAuthority,
      tokenAmount
    };
  }
});
</script>
