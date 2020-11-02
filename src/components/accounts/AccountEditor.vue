<template>
  <div
    style="font-family: 'Racing Sans One', cursive; font-size:70px"
    class="has-text-black has-text-centered	"
  >
    ACCOUNT EDITOR
  </div>
  <article v-if="accountAddress" class="message is-black">
    <div class="message-body">
      Success! Take a look at your account:
      <a :href="accountLink" target="_blank" rel="noopener noreferrer">{{
        accountAddress
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
    <label class="label">Token mint address*</label>
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
      {{ splitAtUppercase(action) }}
    </button>
  </div>
  <keep-alive>
    <component
      :is="currentAccountComponent"
      :payerSecret="payerSecret"
      :tokenAddress="tokenAddress"
      @update:accountAddress="onUpdateAccountAddress"
    />
  </keep-alive>
</template>

<script lang="ts">
import { computed, defineComponent, onErrorCaptured, ref } from "vue";
import { chosenCluster } from "@/solana/connection";
import accountComponents from "./accountComponents";

import TokenMinter from "./TokenMinter.vue";
import AccountFreezer from "./AccountFreezer.vue";
import AccountThawer from "./AccountThawer.vue";
import TokenTransferrer from "./TokenTransferrer.vue";
import OwnerSetter from "./OwnerSetter.vue";
import TokenBurner from "./TokenBurner.vue";
import AccountCloser from "./AccountCloser.vue";
import CloserSetter from "./CloserSetter.vue";

import { splitAtUppercase } from "@/util/stringFormatting";

export default defineComponent({
  components: {
    TokenMinter,
    AccountFreezer,
    AccountThawer,
    TokenTransferrer,
    OwnerSetter,
    TokenBurner,
    AccountCloser,
    CloserSetter
  },
  setup() {
    const payerSecret = ref("");
    const tokenAddress = ref("");
    const accountAddress = ref("");

    const accountLink = computed(
      () =>
        `https://explorer.solana.com/address/${accountAddress.value}?cluster=${chosenCluster.value}`
    );

    const currentAccountComponent = ref(accountComponents.Mint);

    const errorMessage = ref("");
    onErrorCaptured(err => {
      errorMessage.value = (err as Error).message;
      return false;
    });

    const onUpdateAccountAddress = (address: string) => {
      accountAddress.value = address;
      errorMessage.value = "";
    };

    return {
      payerSecret,
      accountLink,
      accountAddress,
      currentAccountComponent,
      accountComponents,
      tokenAddress,
      splitAtUppercase,
      errorMessage,
      onUpdateAccountAddress
    };
  }
});
</script>
