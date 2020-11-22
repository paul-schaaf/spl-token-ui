<template>
  <heading heading="FAUCET CREATOR" />
  <div style="margin-top: 30px">
    <article v-if="createdFaucetAddress" class="message is-black">
      <div class="message-body">
        Success! Take a look at your created faucet:
        <a :href="accountLink" target="_blank" rel="noopener noreferrer">{{
          createdFaucetAddress
        }}</a>
        <copy-icon class="ml-1" :value="createdFaucetAddress" />
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
      <label class="label">Current mint authority*</label>
      <secret-form-field
        v-model:secret="currentAuthoritySecret"
        v-model:signExternally="mintAuthoritySignsExternally"
      />
    </div>
    <div class="field">
      <label class="label">Token mint address*</label>
      <div class="control">
        <input
          v-model="tokenMintAddress"
          class="input is-black"
          type="text"
          placeholder="Token address e.g. GsbwXfJraMomNxBcjYLcG3mxkBUiyWXAB32fGbSMQRdW"
        />
      </div>
    </div>
    <div class="field">
      <label class="label">Admin address</label>
      <public-key-form-field
        derivePublicKey
        v-model:address="adminAddress"
        hint=". You don't have to specify an admin address. If you do, the admin will be able to airdrop themselves any amount of tokens, ignoring the limit you set below."
      />
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
          placeholder="Max tokens that may be airdropped to non-admins per ix"
        />
      </div>
      <p class="help">
        <span
          ><strong @click="setNoLimitAmount" class="is-clickable"
            >Set no limit.</strong
          ></span
        >
        Max tokens that may be airdropped to non-admins per ix. Please be aware
        that you need to use a token's smallest denomination e.g. if you have a
        token with 2 decimals and you type in 200 you will allow users to get 2
        tokens per ix.
      </p>
    </div>
    <div style="display: flex" class="control is-justify-content-center mt-5">
      <button
        :class="{ 'is-loading': creatingFaucet }"
        class="button is-black"
        @click="onCreateFaucet"
      >
        Create new faucet
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { createFaucet } from "@/solana/token";
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
    const currentAuthoritySecret = ref("");
    const mintAuthoritySignsExternally = ref(true);
    const tokenMintAddress = ref("");
    const adminAddress = ref("");
    const tokenAmount = ref("");

    const creatingFaucet = ref(false);
    const accountLink = ref("");
    const errorMessage = ref("");
    const createdFaucetAddress = ref("");

    const setNoLimitAmount = () => {
      tokenAmount.value = new u64([
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255
      ]).toString(10);
    };

    const onCreateFaucet = async () => {
      creatingFaucet.value = true;
      createdFaucetAddress.value = "";
      accountLink.value = "";
      errorMessage.value = "";
      try {
        createdFaucetAddress.value = await createFaucet(
          payerSecret.value,
          feePayerSignsExternally.value,
          currentAuthoritySecret.value,
          mintAuthoritySignsExternally.value,
          tokenMintAddress.value,
          adminAddress.value,
          new u64(tokenAmount.value, 10)
        );
        accountLink.value = `https://explorer.solana.com/address/${createdFaucetAddress.value}?cluster=${chosenCluster.value}`;
      } catch (err) {
        errorMessage.value = SolanaErrorHandler.getErrorMessage(err);
      }
      creatingFaucet.value = false;
    };

    return {
      payerSecret,
      currentAuthoritySecret,
      createdFaucetAddress,
      creatingFaucet,
      accountLink,
      errorMessage,
      feePayerSignsExternally,
      mintAuthoritySignsExternally,
      tokenAmount,
      setNoLimitAmount,
      tokenMintAddress,
      adminAddress,
      onCreateFaucet
    };
  }
};
</script>
