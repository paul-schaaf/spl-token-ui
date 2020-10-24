<template>
  <div class="field">
    <label class="label">Freeze authority*</label>
    <div class="control">
      <input
        v-model="freezeAuthority"
        class="input is-black"
        type="text"
        placeholder="Secret Seed Phrase"
      />
    </div>
    <p class="help">
      Your secret phrase is NOT saved NOR sent anywhere. It's only used to sign
      the account thawing request.
    </p>
  </div>
  <div class="field">
    <label class="label">Account to thaw*</label>
    <div class="control">
      <input
        v-model="accountToThaw"
        class="input is-black"
        type="text"
        placeholder="Public Key String e.g. GsbwXfJraMomNxBcjYLcG3mxkBUiyWXAB32fGbSMQRdW"
      />
    </div>
  </div>
  <div style="display: flex" class="control is-justify-content-center mt-5">
    <button
      :class="{ 'is-loading': thawingAccount }"
      class="button is-black"
      @click="onThawAccount"
    >
      Thaw account
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import accountComponents from "./accountComponents";
import { thawAccount } from "@/solana/token";

export default defineComponent({
  name: accountComponents.Thaw,
  props: {
    payerSeedPhrase: {
      type: String,
      required: true
    },
    tokenAddress: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const { payerSeedPhrase, tokenAddress } = toRefs(props);
    const thawingAccount = ref(false);
    const accountToThaw = ref("");
    const freezeAuthority = ref("");

    const onThawAccount = async () => {
      thawingAccount.value = true;
      emit("update:accountAddress", "");
      try {
        await thawAccount(
          payerSeedPhrase.value,
          tokenAddress.value,
          accountToThaw.value,
          freezeAuthority.value
        );
        emit("update:accountAddress", accountToThaw.value);
      } catch (err) {
        thawingAccount.value = false;
        throw err;
      }
      thawingAccount.value = false;
    };

    return {
      thawingAccount,
      accountToThaw,
      onThawAccount,
      freezeAuthority
    };
  }
});
</script>
