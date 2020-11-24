<template>
  <heading heading="TOKEN FAUCETS" />
  <div style="margin-top: 30px">
    <article v-if="accountAddress" class="message is-black">
      <div class="message-body">
        Success! Take a look at your account:
        <a :href="accountLink" target="_blank" rel="noopener noreferrer">{{
          accountAddress
        }}</a>
        <copy-icon class="ml-1" :value="accountAddress" />
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
    <div
      class="buttons is-justify-content-center"
      style="display: flex; margin-top: 35px"
    >
      <button
        v-for="action in Object.keys(tokenFaucetComponents)"
        :key="action"
        :class="{
          'is-black':
            currentTokenFaucetComponent === tokenFaucetComponents[action]
        }"
        class="button"
        @click="currentTokenFaucetComponent = tokenFaucetComponents[action]"
      >
        {{ splitAtUppercase(action) }}
      </button>
    </div>
    <keep-alive>
      <component
        :is="currentTokenFaucetComponent"
        :payerSecret="payerSecret"
        :payerSignsExternally="payerSignsExternally"
        @update:accountAddress="onUpdateAccountAddress"
      />
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onErrorCaptured, computed } from "vue";
import Heading from "@/components/util/Heading.vue";
import tokenFaucetComponents from "./tokenFaucetComponents";
import { splitAtUppercase } from "@/util/stringFormatting";
import { chosenCluster } from "@/solana/connection";

import SecretFormField from "@/components/util/SecretFormField.vue";
import CopyIcon from "@/components/util/CopyIcon.vue";
import TokenAirdrop from "@/components/airdrops/TokenAirdrop.vue";
import FaucetCreator from "@/components/airdrops/FaucetCreator.vue";
import FaucetCloser from "@/components/airdrops/FaucetCloser.vue";
import * as SolanaErrorHandler from "@/solana/SolanaErrorHandler";

export default defineComponent({
  components: {
    Heading,
    CopyIcon,
    SecretFormField,
    TokenAirdrop,
    FaucetCreator,
    FaucetCloser
  },
  setup() {
    const payerSecret = ref("");
    const payerSignsExternally = ref(true);
    const currentTokenFaucetComponent = ref(
      tokenFaucetComponents.InspectFaucet
    );
    const accountAddress = ref("");
    const accountLink = computed(
      () =>
        `https://explorer.solana.com/address/${accountAddress.value}?cluster=${chosenCluster.value}`
    );
    const onUpdateAccountAddress = (address: string) => {
      accountAddress.value = address;
      errorMessage.value = "";
    };

    const errorMessage = ref("");
    onErrorCaptured(err => {
      errorMessage.value = SolanaErrorHandler.getErrorMessage(err as Error);
      return false;
    });

    return {
      tokenFaucetComponents,
      currentTokenFaucetComponent,
      payerSecret,
      payerSignsExternally,
      splitAtUppercase,
      errorMessage,
      accountAddress,
      onUpdateAccountAddress,
      accountLink
    };
  }
});
</script>
