<template>
  <heading heading="TOKEN AIRDROP" />
  <div style="margin-top: 30px">
    <article v-if="airdroppedAccountAddress" class="message is-black">
      <div class="message-body">
        Success! Take a look at your account:
        <a :href="accountLink" target="_blank" rel="noopener noreferrer">{{
          airdroppedAccountAddress
        }}</a>
        <copy-icon class="ml-1" :value="airdroppedAccountAddress" />
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
        v-model:signExternally="feePayerSignsExternally"
      />
    </div>
    <div class="field">
      <label class="label">Admin</label>
      <secret-form-field
        v-model:secret="adminSecret"
        v-model:signExternally="adminSignsExternally"
        manualHint="You can leave this field empty if you're not the admin of the faucet."
      />
    </div>
    <div class="field">
      <label class="label">Token destination address</label>
      <public-key-form-field v-model:address="addressToAirdrop" />
    </div>
    <div class="field">
      <label class="label">Faucet address</label>
      <public-key-form-field v-model:address="faucetAddress" />
    </div>
    <div class="field">
      <label class="label">Amount*</label>
      <div class="control">
        <input
          v-model="tokenAmount"
          :onkeyup="
            () => {
              if (tokenAmount < 0) {
                tokenAmount *= -1;
              }
            }
          "
          class="input is-black"
          type="text"
          placeholder="Amount of tokens to airdrop"
        />
      </div>
    </div>
    <div style="display: flex" class="control is-justify-content-center mt-5">
      <button
        :class="{ 'is-loading': airdroppingTokens }"
        class="button is-black"
        @click="onAirdropTokens"
      >
        Airdrop tokens
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { airdropTokens } from "@/solana/token";
import { chosenCluster } from "@/solana/connection";
import * as SolanaErrorHandler from "@/solana/SolanaErrorHandler";
import SecretFormField from "@/components/util/SecretFormField.vue";
import CopyIcon from "@/components/util/CopyIcon.vue";
import PublicKeyFormField from "@/components/util/PublicKeyFormField.vue";
import Heading from "@/components/util/Heading.vue";
import { u64 } from "@solana/spl-token";

export default {
  components: {
    SecretFormField,
    CopyIcon,
    PublicKeyFormField,
    Heading
  },
  setup() {
    const payerSecret = ref("");
    const feePayerSignsExternally = ref(true);
    const adminSecret = ref("");
    const adminSignsExternally = ref(false);
    const addressToAirdrop = ref("");
    const tokenAmount = ref("");

    const airdroppingTokens = ref(false);
    const accountLink = ref("");
    const errorMessage = ref("");
    const airdroppedAccountAddress = ref("");
    const faucetAddress = ref("");

    const onAirdropTokens = async () => {
      airdroppingTokens.value = true;
      airdroppedAccountAddress.value = "";
      accountLink.value = "";
      errorMessage.value = "";
      try {
        airdroppedAccountAddress.value = await airdropTokens(
          payerSecret.value,
          feePayerSignsExternally.value,
          faucetAddress.value,
          addressToAirdrop.value,
          adminSecret.value,
          adminSignsExternally.value,
          new u64(tokenAmount.value, 10)
        );
        accountLink.value = `https://explorer.solana.com/address/${airdroppedAccountAddress.value}?cluster=${chosenCluster.value}`;
      } catch (err) {
        errorMessage.value = SolanaErrorHandler.getErrorMessage(err);
      }
      airdroppingTokens.value = false;
    };

    return {
      payerSecret,
      adminSecret,
      airdroppedAccountAddress,
      airdroppingTokens,
      accountLink,
      errorMessage,
      feePayerSignsExternally,
      adminSignsExternally,
      tokenAmount,
      addressToAirdrop,
      onAirdropTokens,
      faucetAddress
    };
  }
};
</script>
