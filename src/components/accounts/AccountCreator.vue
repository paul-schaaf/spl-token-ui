<template>
  <div style="display: flex" class="container is-justify-content-center">
    <div style="width: 650px" class="mt-6">
      <div
        style="font-family: 'Racing Sans One', cursive; font-size:70px"
        class="has-text-black has-text-centered	"
      >
        ACCOUNT CREATOR
      </div>

      <article class="message is-black">
        <div v-if="createdAccountAddress" class="message-body">
          Success! Take a look at your created account:
          <a :href="accountLink" target="_blank" rel="noopener noreferrer">{{
            createdAccountAddress
          }}</a>
        </div>
      </article>
      <div class="field">
        <label class="label">Fee payer*</label>
        <div class="control">
          <input
            v-model="payerSeedPhrase"
            class="input is-black"
            type="text"
            placeholder="Secret Seed Phase"
          />
        </div>
        <p class="help">
          Your secret phrase is NOT saved NOR sent anywhere. It's only used to
          pay the account creation and rent fee.
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
        <label class="label">Account owner*</label>
        <div class="control">
          <input
            v-model="accountOwner"
            class="input is-black"
            type="text"
            placeholder="Public Key String e.g. GsbwXfJraMomNxBcjYLcG3mxkBUiyWXAB32fGbSMQRdW"
          />
        </div>
      </div>
      <div style="display: flex" class="control is-justify-content-center mt-5">
        <button
          :class="{ 'is-loading': creatingAccount }"
          class="button is-black"
          @click="createAccount"
        >
          Create new account
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { createTokenAccount } from "@/solana/token";
import { chosenCluster } from "@/solana/connection";

export default {
  setup() {
    const payerSeedPhrase = ref("");
    const tokenAddress = ref("");
    const accountOwner = ref("");
    const creatingAccount = ref(false);
    const accountLink = ref("");
    const createdAccountAddress = ref("");

    const createAccount = async () => {
      accountLink.value = "";
      creatingAccount.value = true;
      createdAccountAddress.value = "";
      try {
        createdAccountAddress.value = await createTokenAccount(
          payerSeedPhrase.value,
          tokenAddress.value,
          accountOwner.value
        );
        accountLink.value = `https://explorer.solana.com/address/${createdAccountAddress.value}?cluster=${chosenCluster.value}`;
      } catch (err) {
        alert(err);
      }

      creatingAccount.value = false;
    };

    return {
      payerSeedPhrase,
      tokenAddress,
      accountOwner,
      creatingAccount,
      createAccount,
      createdAccountAddress,
      accountLink
    };
  }
};
</script>
