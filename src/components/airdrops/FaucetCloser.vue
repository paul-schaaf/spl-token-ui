<template>
  <heading heading="FAUCET CLOSER" />
  <div style="margin-top: 30px">
    <article v-if="closedFaucetAddress" class="message is-black">
      <div class="message-body">
        Success! Take a look at the closed faucet:
        <a :href="accountLink" target="_blank" rel="noopener noreferrer">{{
          closedFaucetAddress
        }}</a>
        <copy-icon class="ml-1" :value="closedFaucetAddress" />
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
      <label class="label">Faucet Admin*</label>
      <secret-form-field
        v-model:secret="adminSecret"
        v-model:signExternally="adminSignsExternally"
      />
    </div>
    <div class="field">
      <label class="label">Faucet address*</label>
      <public-key-form-field v-model:address="faucetAddress" />
    </div>
    <div class="field">
      <label class="label">Rent destination address*</label>
      <public-key-form-field
        derivePublicKey
        v-model:address="rentDestinationAddress"
        hint=". Account receiving the rent that has been deposited for the faucet account"
      />
    </div>
    <div style="display: flex" class="control is-justify-content-center mt-5">
      <button
        :class="{ 'is-loading': closingFaucet }"
        class="button is-black"
        @click="onCloseFaucet"
      >
        Closet faucet
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { closeFaucet } from "@/solana/token";
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
    const feePayerSignsExternally = ref(true);
    const adminSecret = ref("");
    const adminSignsExternally = ref(true);
    const faucetAddress = ref("");
    const rentDestinationAddress = ref("");

    const closingFaucet = ref(false);
    const accountLink = ref("");
    const errorMessage = ref("");
    const closedFaucetAddress = ref("");

    const onCloseFaucet = async () => {
      closingFaucet.value = true;
      closedFaucetAddress.value = "";
      accountLink.value = "";
      errorMessage.value = "";
      try {
        closedFaucetAddress.value = await closeFaucet(
          payerSecret.value,
          feePayerSignsExternally.value,
          adminSecret.value,
          adminSignsExternally.value,
          faucetAddress.value,
          rentDestinationAddress.value
        );
        accountLink.value = `https://explorer.solana.com/address/${closedFaucetAddress.value}?cluster=${chosenCluster.value}`;
      } catch (err) {
        errorMessage.value = SolanaErrorHandler.getErrorMessage(err);
      }
      closingFaucet.value = false;
    };

    return {
      payerSecret,
      adminSecret,
      closedFaucetAddress,
      closingFaucet,
      accountLink,
      errorMessage,
      feePayerSignsExternally,
      adminSignsExternally,
      onCloseFaucet,
      faucetAddress,
      rentDestinationAddress
    };
  }
};
</script>
