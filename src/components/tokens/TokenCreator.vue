<template>
  <div style="display: flex" class="container is-justify-content-center">
    <div style="width: 650px" class="mt-6">
      <div
        style="font-family: 'Racing Sans One', cursive; font-size:70px"
        class="has-text-black has-text-centered	"
      >
        TOKEN CREATOR
      </div>

      <article class="message is-black">
        <div v-if="createdTokenAddress" class="message-body">
          Success! Take a look at your created token:
          <a :href="tokenLink" target="_blank" rel="noopener noreferrer">{{
            createdTokenAddress
          }}</a>
        </div>
      </article>
      <div class="field">
        <label class="label">Fee payer*</label>
        <div style="display: flex" class="control">
          <input
            v-model="payerSeedPhrase"
            class="input is-black"
            type="text"
            placeholder="Secret Seed Phase"
          />
        </div>
        <p class="help">
          Your secret phrase is NOT saved NOR sent anywhere. It's only used to
          pay the token minting fee.
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
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { createNewToken } from "@/solana/token";
import { chosenCluster } from "@/solana/connection";

export default {
  setup() {
    const payerSeedPhrase = ref("");
    const mintAuthority = ref("");
    const freezeAuthority = ref("");
    const tokenDecimals = ref(0);
    const createdTokenAddress = ref("");
    const creatingToken = ref(false);
    const tokenLink = ref("");

    const createToken = async () => {
      tokenLink.value = "";
      createdTokenAddress.value = "";
      creatingToken.value = true;
      try {
        createdTokenAddress.value = await createNewToken(
          payerSeedPhrase.value,
          mintAuthority.value,
          freezeAuthority.value,
          tokenDecimals.value
        );
        tokenLink.value = `https://explorer.solana.com/address/${createdTokenAddress.value}?cluster=${chosenCluster.value}`;
      } catch (err) {
        alert(err);
      }

      creatingToken.value = false;
    };

    return {
      payerSeedPhrase,
      mintAuthority,
      freezeAuthority,
      tokenDecimals,
      createdTokenAddress,
      createToken,
      creatingToken,
      tokenLink
    };
  }
};
</script>
