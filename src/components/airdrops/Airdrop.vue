<template>
  <heading heading="SOL AIRDROP" />

  <div style="margin-top: 30px">
    <template v-if="notMainnet">
      <article v-if="addressThatReceivedAirdrop" class="message is-black">
        <div class="message-body">
          Success! Take a look at your account:
          <a :href="accountLink" target="_blank" rel="noopener noreferrer">{{
            addressThatReceivedAirdrop
          }}</a>
          <copy-icon class="ml-1" :value="addressThatReceivedAirdrop" />
        </div>
      </article>
      <article v-else-if="errorMessage" class="message is-danger">
        <div class="message-body">
          {{ errorMessage }}
        </div>
      </article>
      <div class="field">
        <label class="label">SOL address to send airdrop to*</label>
        <public-key-form-field
          derivePublicKey
          v-model:address="addressToAirdrop"
        />
      </div>
      <div class="field">
        <label class="label">Amount*</label>
        <div class="control">
          <input
            v-model="amount"
            :onkeyup="
              () => {
                if (amount < 0) {
                  amount *= -1;
                } else if (amount > 10) {
                  amount = 10;
                }
              }
            "
            class="input is-black"
            type="number"
            placeholder="Amount of SOL to airdrop"
            min="1"
          />
        </div>
        <p class="help">Max 10 SOL may be requested at once.</p>
      </div>
      <div style="display: flex" class="control is-justify-content-center mt-5">
        <button
          :class="{ 'is-loading': requestingAirdrop }"
          class="button is-black"
          @click="onRequestAirdrop"
        >
          Request Airdrop
        </button>
      </div>
    </template>
    <div v-else class="has-text-centered">
      Please refer to
      <a
        href="http://www.bonfida.com/airdrop"
        target="_blank"
        rel="noopener noreferrer"
        >Bonfida</a
      >
      to receive an airdrop on mainnet
    </div>
  </div>
</template>

<script lang="ts">
import Heading from "@/components/util/Heading.vue";
import PublicKeyFormField from "@/components/util/PublicKeyFormField.vue";
import CopyIcon from "@/components/util/CopyIcon.vue";
import { requestAirdrop } from "@/solana/airdrop";
import { chosenCluster } from "@/solana/connection";
import * as SolanaErrorHandler from "@/solana/SolanaErrorHandler";

import { computed, defineComponent, ref } from "vue";
export default defineComponent({
  components: {
    Heading,
    PublicKeyFormField,
    CopyIcon
  },
  setup() {
    const addressToAirdrop = ref("");
    const requestingAirdrop = ref(false);
    const amount = ref(10);
    const addressThatReceivedAirdrop = ref("");
    const accountLink = ref("");
    const errorMessage = ref("");

    const onRequestAirdrop = async () => {
      requestingAirdrop.value = true;
      errorMessage.value = "";
      accountLink.value = "";
      const addressStatic = addressToAirdrop.value;
      addressThatReceivedAirdrop.value = "";
      try {
        await requestAirdrop(addressToAirdrop.value, amount.value);
        addressThatReceivedAirdrop.value = addressStatic;
        accountLink.value = `https://explorer.solana.com/address/${addressThatReceivedAirdrop.value}?cluster=${chosenCluster.value}`;
      } catch (err) {
        errorMessage.value = SolanaErrorHandler.getErrorMessage(err);
      }
      requestingAirdrop.value = false;
    };

    const notMainnet = computed(() => chosenCluster.value !== "mainnet-beta");

    return {
      addressToAirdrop,
      requestingAirdrop,
      amount,
      onRequestAirdrop,
      accountLink,
      errorMessage,
      addressThatReceivedAirdrop,
      notMainnet
    };
  }
});
</script>
