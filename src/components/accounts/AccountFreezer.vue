<template>
  <div class="field">
    <label class="label">Freeze authority*</label>
    <div class="control">
      <input
        v-model="freezeAuthority"
        class="input is-black"
        type="text"
        placeholder="Secret (seed phrase or comma-separated array of 64 numbers)"
      />
    </div>
    <p class="help">
      Your secret is NOT saved NOR sent anywhere. It's only used to sign the
      account freezing request.
    </p>
  </div>
  <div class="field">
    <label class="label">Account to freeze*</label>
    <div class="control">
      <input
        v-model="accountToFreeze"
        class="input is-black"
        type="text"
        placeholder="Public Key String e.g. GsbwXfJraMomNxBcjYLcG3mxkBUiyWXAB32fGbSMQRdW"
      />
    </div>
  </div>
  <div style="display: flex" class="control is-justify-content-center mt-5">
    <button
      :class="{ 'is-loading': freezingAccount }"
      class="button is-black"
      @click="onFreezeAccount"
    >
      Freeze account
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import accountComponents from "./accountComponents";
import { freezeAccount } from "@/solana/token";

export default defineComponent({
  name: accountComponents.Freeze,
  props: {
    payerSecret: {
      type: String,
      required: true
    },
    tokenAddress: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const { payerSecret, tokenAddress } = toRefs(props);
    const freezingAccount = ref(false);
    const accountToFreeze = ref("");
    const freezeAuthority = ref("");

    const onFreezeAccount = async () => {
      freezingAccount.value = true;
      emit("update:accountAddress", "");
      try {
        await freezeAccount(
          payerSecret.value,
          tokenAddress.value,
          accountToFreeze.value,
          freezeAuthority.value
        );
        emit("update:accountAddress", accountToFreeze.value);
      } catch (err) {
        freezingAccount.value = false;
        throw err;
      }
      freezingAccount.value = false;
    };

    return {
      freezingAccount,
      accountToFreeze,
      onFreezeAccount,
      freezeAuthority
    };
  }
});
</script>
