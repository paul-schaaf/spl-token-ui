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
        <div v-if="accountAddress" class="message-body">
          Success! Take a look at your account:
          <a :href="accountLink" target="_blank" rel="noopener noreferrer">{{
            accountAddress
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
      <TokenMinter
        :payerSeedPhrase="payerSeedPhrase"
        v-model:accountAddress="accountAddress"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref } from "vue";
import { chosenCluster } from "@/solana/connection";
import TokenMinter from "./TokenMinter.vue";

export default {
  components: {
    TokenMinter
  },
  setup() {
    const payerSeedPhrase = ref("");
    const accountAddress = ref("");

    const accountLink = computed(
      () =>
        `https://explorer.solana.com/address/${accountAddress.value}?cluster=${chosenCluster.value}`
    );
    return {
      payerSeedPhrase,
      accountLink,
      accountAddress
    };
  }
};
</script>
