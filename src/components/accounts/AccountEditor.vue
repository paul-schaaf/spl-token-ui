<template>
  <div style="display: flex" class="container is-justify-content-center">
    <div style="width: 650px" class="mt-6">
      <div
        style="font-family: 'Racing Sans One', cursive; font-size:70px"
        class="has-text-black has-text-centered	"
      >
        ACCOUNT EDITOR
      </div>

      <article class="message is-black">
        <div v-if="creditedAccountAddress" class="message-body">
          Success! Take a look at your account:
          <a :href="accountLink" target="_blank" rel="noopener noreferrer">{{
            creditedAccountAddress
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
      <TokenMinter :payerSeedPhrase="payerSeedPhrase" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { mintToken } from "@/solana/token";
import { chosenCluster } from "@/solana/connection";
import TokenMinter from "./TokenMinter.vue";

export default {
  components: {
    TokenMinter
  },
  setup() {
    const payerSeedPhrase = ref("");
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
      payerSeedPhrase,
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
};
</script>
