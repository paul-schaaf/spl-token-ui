<template>
  <heading heading="ACCOUNT CREATOR" />
  <div style="margin-top: 30px">
    <article v-if="createdAccountAddress" class="message is-black">
      <div class="message-body">
        Success! Take a look at your created account:
        <a :href="accountLink" target="_blank" rel="noopener noreferrer">{{
          createdAccountAddress
        }}</a>
        <copy-icon class="ml-1" :value="createdAccountAddress" />
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
      <public-key-form-field v-model:address="tokenMintAddress" />
    </div>
    <div class="field">
      <label class="label">Account owner*</label>
      <public-key-form-field
        v-model:address="accountOwnerAddress"
        derivePublicKey
      />
    </div>
    <div
      style="display: flex; margin-top: 35px"
      class="is-justify-content-center"
    >
      <p><strong> Create normal account</strong></p>
      <Toggle v-model:checked="creatingAssociatedAccount" class="ml-2" />
      <p class="ml-2"><strong> Create associated account</strong></p>
    </div>
    <div style="display: flex" class="control is-justify-content-center mt-6">
      <button
        :class="{ 'is-loading': creatingAccount }"
        class="button is-black"
        @click="createAccount"
      >
        Create new account
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import {
  createTokenAccount,
  createAssociatedTokenAccount
} from "@/solana/token";
import { chosenCluster } from "@/solana/connection";
import * as SolanaErrorHandler from "@/solana/SolanaErrorHandler";
import SecretFormField from "@/components/util/SecretFormField.vue";
import CopyIcon from "@/components/util/CopyIcon.vue";
import PublicKeyFormField from "@/components/util/PublicKeyFormField.vue";
import Heading from "@/components/util/Heading.vue";
import Toggle from "@/components/util/Toggle.vue";

export default {
  components: {
    SecretFormField,
    CopyIcon,
    PublicKeyFormField,
    Heading,
    Toggle
  },
  setup() {
    const payerSecret = ref("");
    const payerSignsExternally = ref(true);
    const tokenMintAddress = ref("");
    const accountOwnerAddress = ref("");
    const creatingAccount = ref(false);
    const accountLink = ref("");
    const createdAccountAddress = ref("");
    const errorMessage = ref("");
    const creatingAssociatedAccount = ref(false);

    const createAccount = async () => {
      accountLink.value = "";
      creatingAccount.value = true;
      createdAccountAddress.value = "";
      errorMessage.value = "";
      try {
        createdAccountAddress.value = creatingAssociatedAccount.value
          ? await createAssociatedTokenAccount(
              payerSecret.value,
              payerSignsExternally.value,
              tokenMintAddress.value,
              accountOwnerAddress.value
            )
          : await createTokenAccount(
              payerSecret.value,
              tokenMintAddress.value,
              accountOwnerAddress.value,
              payerSignsExternally.value
            );
        accountLink.value = `https://explorer.solana.com/address/${createdAccountAddress.value}?cluster=${chosenCluster.value}`;
      } catch (err) {
        errorMessage.value = SolanaErrorHandler.getErrorMessage(err);
      }

      creatingAccount.value = false;
    };

    return {
      payerSecret,
      tokenMintAddress,
      accountOwnerAddress,
      creatingAccount,
      createAccount,
      createdAccountAddress,
      accountLink,
      errorMessage,
      payerSignsExternally,
      creatingAssociatedAccount
    };
  }
};
</script>
