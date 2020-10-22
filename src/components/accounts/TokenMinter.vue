<template>
  <div class="field">
    <label class="label">Mint authority*</label>
    <div style="display: flex" class="control">
      <input
        v-model="mintAuthority"
        class="input is-black"
        type="text"
        placeholder="Secret Seed Phase"
      />
    </div>
    <p class="help">
      Your secret phrase is NOT saved NOR sent anywhere. It's only used to sign
      the token minting request.
    </p>
  </div>
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
    <div style="display: flex" class="control">
      <input
        v-model="tokenAmount"
        class="input is-black"
        type="number"
        placeholder="Token mint to mint e.g. 20000"
      />
    </div>
    <p class="help">
      Please be aware that a token is minted using its smallest denomination
      e.g. if you have a token with 2 decimals and you type in 200 you will mint
      2 tokens.
    </p>
  </div>
  <div
    style="display: flex; margin-bottom: 40px"
    class="control is-justify-content-center mt-5"
  >
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
import { chosenCluster } from "@/solana/connection";

export default defineComponent({
  props: {
    payerSeedPhrase: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { payerSeedPhrase } = toRefs(props);
    const tokenAddress = ref("");
    const mintAuthority = ref("");
    const destinationAccount = ref("");
    const mintingToAccount = ref(false);
    const accountLink = ref("");
    const creditedAccountAddress = ref("");
    const tokenAmount = ref(0);

    const mintToAccount = async () => {
      accountLink.value = "";
      mintingToAccount.value = true;
      creditedAccountAddress.value = "";
      try {
        await mintToken(
          payerSeedPhrase.value,
          tokenAddress.value,
          mintAuthority.value,
          destinationAccount.value,
          tokenAmount.value
        );
        creditedAccountAddress.value = destinationAccount.value;
        accountLink.value = `https://explorer.solana.com/address/${creditedAccountAddress.value}?cluster=${chosenCluster.value}`;
      } catch (err) {
        alert(err);
      }

      mintingToAccount.value = false;
    };

    return {
      tokenAddress,
      destinationAccount,
      mintingToAccount,
      mintToAccount,
      creditedAccountAddress,
      accountLink,
      mintAuthority,
      tokenAmount
    };
  }
});
</script>
