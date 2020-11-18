<template>
  <heading heading="TOKEN EDITOR" />
  <div style="margin-top: 30px">
    <article v-if="editedTokenAddress" class="message is-black">
      <div class="message-body">
        Success! Take a look at your edited token:
        <a :href="tokenLink" target="_blank" rel="noopener noreferrer">{{
          editedTokenAddress
        }}</a>
        <copy-icon class="ml-1" :value="editedTokenAddress" />
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
      <label class="label">Token mint address*</label>
      <div class="control">
        <input
          v-model="tokenAddress"
          class="input is-black"
          type="text"
          placeholder="Token address e.g. GsbwXfJraMomNxBcjYLcG3mxkBUiyWXAB32fGbSMQRdW"
        />
      </div>
    </div>
    <div
      style="display: flex; margin-top: 35px"
      class="is-justify-content-center"
    >
      <p><strong> Edit mint authority</strong></p>
      <Toggle v-model:checked="editingFreezeAuthority" class="ml-2" />
      <p class="ml-2"><strong> Edit freeze authority</strong></p>
    </div>
    <div class="field mt-5">
      <label class="label"
        >Current
        {{ editingFreezeAuthority ? "freeze" : "mint" }} authority*</label
      >
      <div class="control">
        <secret-form-field
          v-model:secret="currentAuthority"
          v-model:signExternally="currentAuthoritySignsExternally"
        />
      </div>
    </div>

    <div class="field">
      <label class="label"
        >New {{ editingFreezeAuthority ? "freeze" : "mint" }} authority</label
      >
      <public-key-form-field
        v-model:address="newAuthorityAddress"
        derivePublicKey
        hint=". You can leave this field empty to remove the authority from the token."
      />
    </div>
    <div style="display: flex" class="control is-justify-content-center mt-5">
      <button
        :class="{ 'is-loading': editingToken }"
        class="button is-black"
        @click="onEditToken"
      >
        Edit token
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { editToken } from "@/solana/token";
import { chosenCluster } from "@/solana/connection";
import { AuthorityType } from "@solana/spl-token";
import Toggle from "@/components/util/Toggle.vue";
import * as SolanaErrorHandler from "@/solana/SolanaErrorHandler";
import SecretFormField from "@/components/util/SecretFormField.vue";
import CopyIcon from "@/components/util/CopyIcon.vue";
import PublicKeyFormField from "@/components/util/PublicKeyFormField.vue";
import Heading from "@/components/util/Heading.vue";

export default {
  components: {
    Toggle,
    SecretFormField,
    CopyIcon,
    PublicKeyFormField,
    Heading
  },
  setup() {
    const payerSecret = ref("");
    const feePayerSignsExternally = ref(true);

    const tokenAddress = ref("");
    const editingFreezeAuthority = ref(false);

    const currentAuthority = ref("");
    const currentAuthoritySignsExternally = ref(true);

    const newAuthorityAddress = ref("");
    const editedTokenAddress = ref("");
    const tokenLink = ref("");
    const editingToken = ref(false);
    const errorMessage = ref("");

    const onEditToken = async () => {
      tokenLink.value = "";
      editedTokenAddress.value = "";
      editingToken.value = true;
      errorMessage.value = "";
      try {
        const authorityType: AuthorityType = editingFreezeAuthority.value
          ? "FreezeAccount"
          : "MintTokens";
        await editToken(
          payerSecret.value,
          tokenAddress.value,
          newAuthorityAddress.value,
          currentAuthority.value,
          authorityType,
          feePayerSignsExternally.value,
          currentAuthoritySignsExternally.value
        );
        editedTokenAddress.value = tokenAddress.value;
        tokenLink.value = `https://explorer.solana.com/address/${tokenAddress.value}?cluster=${chosenCluster.value}`;
      } catch (err) {
        errorMessage.value = SolanaErrorHandler.getErrorMessage(err);
      }

      editingToken.value = false;
    };

    return {
      payerSecret,
      newAuthorityAddress,
      currentAuthority,
      editingFreezeAuthority,
      tokenAddress,
      editedTokenAddress,
      onEditToken,
      editingToken,
      tokenLink,
      errorMessage,
      feePayerSignsExternally,
      currentAuthoritySignsExternally
    };
  }
};
</script>
