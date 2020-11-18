<template>
  <heading heading="TOKEN CREATOR" />
  <div style="margin-top: 30px">
    <article v-if="createdTokenAddress" class="message is-black">
      <div class="message-body">
        Success! Take a look at your created token:
        <a :href="tokenLink" target="_blank" rel="noopener noreferrer">{{
          createdTokenAddress
        }}</a>
        <copy-icon class="ml-1" :value="createdTokenAddress" />
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
        v-model:signExternally="signExternally"
      />
    </div>
    <div class="field">
      <label class="label">Mint authority*</label>
      <public-key-form-field
        v-model:address="mintAuthorityAddress"
        derivePublicKey
      />
    </div>
    <div class="field">
      <label class="label">Freeze authority</label>
      <public-key-form-field
        v-model:address="freezeAuthorityAddress"
        derivePublicKey
        hint=". You can leave this empty if you don't want to set a freeze authority"
      />
    </div>
    <div class="field">
      <label class="label">Decimals*</label>
      <div class="control">
        <input
          v-model="tokenDecimals"
          class="input is-black"
          type="number"
          placeholder="Number of decimals the token should have"
        />
      </div>
    </div>
    <div style="display: flex" class="control is-justify-content-center mt-5">
      <button
        :class="{ 'is-loading': creatingToken }"
        class="button is-black"
        @click="createToken"
      >
        Create new token
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { createNewToken } from "@/solana/token";
import { chosenCluster } from "@/solana/connection";
import * as SolanaErrorHandler from "@/solana/SolanaErrorHandler";
import SecretFormField from "@/components/util/SecretFormField.vue";
import CopyIcon from "@/components/util/CopyIcon.vue";
import PublicKeyFormField from "@/components/util/PublicKeyFormField.vue";
import Heading from "@/components/util/Heading.vue";

export default {
  components: {
    SecretFormField,
    CopyIcon,
    PublicKeyFormField,
    Heading
  },
  setup() {
    const payerSecret = ref("");
    const mintAuthorityAddress = ref("");
    const freezeAuthorityAddress = ref("");
    const tokenDecimals = ref(0);
    const createdTokenAddress = ref("");
    const creatingToken = ref(false);
    const tokenLink = ref("");
    const errorMessage = ref("");
    const signExternally = ref(true);

    const createToken = async () => {
      tokenLink.value = "";
      createdTokenAddress.value = "";
      creatingToken.value = true;
      errorMessage.value = "";
      try {
        createdTokenAddress.value = await createNewToken(
          payerSecret.value,
          mintAuthorityAddress.value,
          freezeAuthorityAddress.value,
          tokenDecimals.value,
          signExternally.value
        );
        tokenLink.value = `https://explorer.solana.com/address/${createdTokenAddress.value}?cluster=${chosenCluster.value}`;
      } catch (err) {
        errorMessage.value = SolanaErrorHandler.getErrorMessage(err);
      }

      creatingToken.value = false;
    };

    return {
      payerSecret,
      mintAuthorityAddress,
      freezeAuthorityAddress,
      tokenDecimals,
      createdTokenAddress,
      createToken,
      creatingToken,
      tokenLink,
      errorMessage,
      signExternally
    };
  }
};
</script>
