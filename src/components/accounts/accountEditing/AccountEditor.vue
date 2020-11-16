<template>
  <div
    style="font-family: 'Racing Sans One', cursive; font-size:70px"
    class="has-text-black has-text-centered	"
  >
    ACCOUNT EDITOR
  </div>
  <div style="margin-top: 30px">
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
      <secret-form-field
        v-model:secret="payerSecret"
        v-model:signExternally="payerSignsExternally"
      />
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
        :payerSignsExternally="payerSignsExternally"
        @update:accountAddress="onUpdateAccountAddress"
      />
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onErrorCaptured, ref } from "vue";
import { chosenCluster } from "@/solana/connection";
import accountComponents from "../accountComponents";

import TokenMinter from "./TokenMinter.vue";
import AccountFreezer from "./AccountFreezer.vue";
import AccountThawer from "./AccountThawer.vue";
import TokenTransferrer from "./TokenTransferrer.vue";
import OwnerSetter from "./OwnerSetter.vue";
import TokenBurner from "./TokenBurner.vue";
import AccountCloser from "./AccountCloser.vue";
import CloserSetter from "./CloserSetter.vue";

import { splitAtUppercase } from "@/util/stringFormatting";
import * as SolanaErrorHandler from "@/solana/SolanaErrorHandler";
import SecretFormField from "@/components/util/SecretFormField.vue";

export default defineComponent({
  components: {
    TokenMinter,
    AccountFreezer,
    AccountThawer,
    TokenTransferrer,
    OwnerSetter,
    TokenBurner,
    AccountCloser,
    CloserSetter,
    SecretFormField
  },
  setup() {
    const payerSecret = ref("");
    const payerSignsExternally = ref(true);

    const tokenAddress = ref("");
    const accountAddress = ref("");

    const accountLink = computed(
      () =>
        `https://explorer.solana.com/address/${accountAddress.value}?cluster=${chosenCluster.value}`
    );

    const currentAccountComponent = ref(accountComponents.Mint);

    const errorMessage = ref("");
    onErrorCaptured(err => {
      errorMessage.value = SolanaErrorHandler.getErrorMessage(err as Error);
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
      onUpdateAccountAddress,
      payerSignsExternally
    };
  }
});
</script>
