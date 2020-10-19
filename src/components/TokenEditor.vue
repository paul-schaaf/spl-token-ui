<template>
  <div style="display: flex" class="container is-justify-content-center">
    <div style="width: 650px" class="mt-6">
      <div
        style="font-family: 'Racing Sans One', cursive; font-size:70px"
        class="has-text-black has-text-centered	"
      >
        TOKEN EDITOR
      </div>

      <article class="message is-black">
        <div v-if="editedTokenAddress" class="message-body">
          Success! Take a look at your edited token:
          <a :href="tokenLink" target="_blank" rel="noopener noreferrer">{{
            editedTokenAddress
          }}</a>
        </div>
      </article>
      <div class="field">
        <label class="label">Fee payer*</label>
        <div class="control">
          <input
            v-model="payerSeedPhrase"
            class="input is-black"
            type="text"
            placeholder="Secret Seed Phase"
          />
        </div>
        <p class="help">
          Your secret phrase is NOT saved NOR sent anywhere. It's only used to
          pay the token minting fee.
        </p>
      </div>
      <div class="field">
        <label class="label">Token address*</label>
        <div class="control">
          <input
            v-model="tokenAddress"
            class="input is-black"
            type="text"
            placeholder="Public Key String e.g. GsbwXfJraMomNxBcjYLcG3mxkBUiyWXAB32fGbSMQRdW"
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
          <input
            v-model="currentAuthority"
            class="input is-black"
            type="text"
            placeholder="Secret Seed Phase"
          />
          <p class="help">
            Your secret phrase is NOT saved NOR sent anywhere. It's only used to
            sign the authority change request.
          </p>
        </div>
      </div>

      <div class="field">
        <label class="label"
          >New
          {{ editingFreezeAuthority ? "freeze" : "mint" }} authority*</label
        >
        <div class="control">
          <input
            v-model="newAuthority"
            class="input is-black"
            type="text"
            placeholder="Public Key String e.g. GsbwXfJraMomNxBcjYLcG3mxkBUiyWXAB32fGbSMQRdW"
          />
        </div>
      </div>
      <div style="display: flex" class="control is-justify-content-center">
        <button
          :class="{ 'is-loading': editingToken }"
          class="button is-black"
          @click="onEditToken"
        >
          Edit token
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { editToken } from "@/solana/token";
import { chosenCluster } from "@/solana/connection";
import Toggle from "@/components/util/Toggle.vue";
import { AuthorityType } from "@solana/spl-token";

export default {
  components: {
    Toggle
  },
  setup() {
    const payerSeedPhrase = ref("");
    const tokenAddress = ref("");
    const editingFreezeAuthority = ref(false);
    const currentAuthority = ref("");
    const newAuthority = ref("");
    const editedTokenAddress = ref("");
    const tokenLink = ref("");
    const editingToken = ref(false);

    const onEditToken = async () => {
      tokenLink.value = "";
      editedTokenAddress.value = "";
      editingToken.value = true;
      try {
        const authorityType: AuthorityType = editingFreezeAuthority.value
          ? "FreezeAccount"
          : "MintTokens";
        await editToken(
          payerSeedPhrase.value,
          tokenAddress.value,
          newAuthority.value,
          currentAuthority.value,
          authorityType
        );
        editedTokenAddress.value = tokenAddress.value;
        tokenLink.value = `https://explorer.solana.com/address/${tokenAddress.value}?cluster=${chosenCluster.value}`;
      } catch (err) {
        alert(err);
      }

      editingToken.value = false;
    };

    return {
      payerSeedPhrase,
      newAuthority,
      currentAuthority,
      editingFreezeAuthority,
      tokenAddress,
      editedTokenAddress,
      onEditToken,
      editingToken,
      tokenLink
    };
  }
};
</script>
