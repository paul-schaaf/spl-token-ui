<template>
  <div
    style="font-family: 'Racing Sans One', cursive; font-size:70px"
    class="has-text-black has-text-centered	"
  >
    TOKEN CREATOR
  </div>

  <article v-if="createdTokenAddress" class="message is-black">
    <div class="message-body">
      Success! Take a look at your created token:
      <a :href="tokenLink" target="_blank" rel="noopener noreferrer">{{
        createdTokenAddress
      }}</a>
    </div>
  </article>
  <article v-else-if="errorMessage" class="message is-danger">
    <div class="message-body">
      {{ errorMessage }}
    </div>
  </article>
  <div class="field">
    <label class="label">Fee payer*</label>
    <div class="control">
      <input
        v-model="payerSecret"
        class="input is-black"
        type="text"
        placeholder="Secret (seed phrase or comma-separated array of 64 numbers)"
      />
    </div>
    <p class="help">
      Your secret is NOT saved NOR sent anywhere. It's only used to pay the
      token minting fee.
    </p>
  </div>
  <div class="field">
    <label class="label">Mint authority*</label>
    <div class="control">
      <input
        v-model="mintAuthority"
        class="input is-black"
        type="text"
        placeholder="Public Key String e.g. GsbwXfJraMomNxBcjYLcG3mxkBUiyWXAB32fGbSMQRdW"
      />
    </div>
  </div>
  <div class="field">
    <label class="label">Freeze authority</label>
    <div class="control">
      <input
        v-model="freezeAuthority"
        class="input is-black"
        type="text"
        placeholder="Public Key String e.g. GsbwXfJraMomNxBcjYLcG3mxkBUiyWXAB32fGbSMQRdW"
      />
    </div>
    <p class="help">
      You can leave this empty if you don't want to set a freeze authority
    </p>
  </div>
  <div class="field">
    <label class="label">Decimals*</label>
    <div class="control">
      <input
        v-model="tokenDecimals"
        class="input is-black"
        type="number"
        placeholder="Number of decimals the token should have"
      />
    </div>
  </div>
  <div style="display: flex" class="control is-justify-content-center mt-5">
    <button
      :class="{ 'is-loading': creatingToken }"
      class="button is-black"
      @click="createToken"
    >
      Create new token
    </button>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { createNewToken } from "@/solana/token";
import { chosenCluster } from "@/solana/connection";

export default {
  setup() {
    const payerSecret = ref("");
    const mintAuthority = ref("");
    const freezeAuthority = ref("");
    const tokenDecimals = ref(0);
    const createdTokenAddress = ref("");
    const creatingToken = ref(false);
    const tokenLink = ref("");
    const errorMessage = ref("");

    const createToken = async () => {
      tokenLink.value = "";
      createdTokenAddress.value = "";
      creatingToken.value = true;
      errorMessage.value = "";
      try {
        createdTokenAddress.value = await createNewToken(
          payerSecret.value,
          mintAuthority.value,
          freezeAuthority.value,
          tokenDecimals.value
        );
        tokenLink.value = `https://explorer.solana.com/address/${createdTokenAddress.value}?cluster=${chosenCluster.value}`;
      } catch (err) {
        errorMessage.value = err.message;
      }

      creatingToken.value = false;
    };

    return {
      payerSecret,
      mintAuthority,
      freezeAuthority,
      tokenDecimals,
      createdTokenAddress,
      createToken,
      creatingToken,
      tokenLink,
      errorMessage
    };
  }
};
</script>
