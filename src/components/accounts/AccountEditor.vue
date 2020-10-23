<template>
  <div style="display: flex" class="container is-justify-content-center">
    <div style="width: 650px; margin-bottom: 40px;" class="mt-6">
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
          pay the token minting fee.
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
      <div
        class="buttons is-justify-content-center"
        style="display: flex; margin-top: 35px"
      >
        <button
          v-for="action in Object.keys(accountComponents)"
          :key="action"
          :class="{
            'is-black': currentAccountComponent === accountComponents[action]
          }"
          class="button"
          @click="currentAccountComponent = accountComponents[action]"
        >
          {{ action }}
        </button>
      </div>
      <keep-alive>
        <component
          :is="currentAccountComponent"
          :payerSeedPhrase="payerSeedPhrase"
          :tokenAddress="tokenAddress"
          @update:accountAddress="accountAddress = $event"
        />
      </keep-alive>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref } from "vue";
import { chosenCluster } from "@/solana/connection";
import accountComponents from "./accountComponents";

import TokenMinter from "./TokenMinter.vue";
import AccountFreezer from "./AccountFreezer.vue";
import AccountThawer from "./AccountThawer.vue";
import TokenTransferrer from "./TokenTransferrer.vue";

export default {
  components: {
    TokenMinter,
    AccountFreezer,
    AccountThawer,
    TokenTransferrer
  },
  setup() {
    const payerSeedPhrase = ref("");
    const tokenAddress = ref("");
    const accountAddress = ref("");

    const accountLink = computed(
      () =>
        `https://explorer.solana.com/address/${accountAddress.value}?cluster=${chosenCluster.value}`
    );

    const currentAccountComponent = ref(accountComponents["Mint"]);

    return {
      payerSeedPhrase,
      accountLink,
      accountAddress,
      currentAccountComponent,
      accountComponents,
      tokenAddress
    };
  }
};
</script>
