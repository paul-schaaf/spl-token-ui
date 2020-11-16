<template>
  <div class="field">
    <label class="label">Account address*</label>
    <input
      v-model="accountAddress"
      class="input is-black"
      type="text"
      placeholder="Public Key String e.g. GsbwXfJraMomNxBcjYLcG3mxkBUiyWXAB32fGbSMQRdW"
    />
  </div>
  <div class="field">
    <label class="label"> Owner or close authority*</label>
    <div class="control">
      <input
        v-model="owner"
        class="input is-black"
        type="text"
        placeholder="Secret (seed phrase or comma-separated array of 64 numbers)"
      />
    </div>
    <p class="help">
      Your secret is NOT saved NOR sent anywhere. It's only used to sign the
      owner change request fee. If there is no "close authority", the owner can
      close the account, otherwise only the "close authority" may do so.
    </p>
  </div>
  <div class="field">
    <label class="label">Destination account*</label>
    <div class="control">
      <input
        v-model="destinationAccount"
        class="input is-black"
        type="text"
        placeholder="Public Key String e.g. GsbwXfJraMomNxBcjYLcG3mxkBUiyWXAB32fGbSMQRdW"
      />
    </div>
    <p class="help">
      This is the account that your rent reserve for the closed account gets
      sent to.
    </p>
  </div>
  <div style="display: flex" class="control is-justify-content-center mt-5">
    <button
      :class="{ 'is-loading': closingAccount }"
      class="button is-black"
      @click="onCloseAccount"
    >
      Close account
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import accountComponents from "../accountComponents";
import { closeAccount } from "@/solana/token";

export default defineComponent({
  name: accountComponents.Close,
  emits: ["update:accountAddress"],
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
    const closingAccount = ref(false);
    const accountAddress = ref("");
    const owner = ref("");
    const destinationAccount = ref("");

    const onCloseAccount = async () => {
      closingAccount.value = true;
      emit("update:accountAddress", "");
      try {
        await closeAccount(
          payerSecret.value,
          tokenAddress.value,
          accountAddress.value,
          destinationAccount.value,
          owner.value
        );
        emit("update:accountAddress", accountAddress.value);
      } catch (err) {
        closingAccount.value = false;
        throw err;
      }
      closingAccount.value = false;
    };

    return {
      closingAccount,
      accountAddress,
      onCloseAccount,
      owner,
      destinationAccount
    };
  }
});
</script>
