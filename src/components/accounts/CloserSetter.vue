<template>
  <div class="field">
    <label class="label">Account address*</label>
    <div class="control">
      <input
        v-model="accountAddress"
        class="input is-black"
        type="text"
        placeholder="Public Key String e.g. GsbwXfJraMomNxBcjYLcG3mxkBUiyWXAB32fGbSMQRdW"
      />
    </div>
  </div>
  <div class="field">
    <label class="label">Current close authority or owner*</label>
    <div class="control">
      <input
        v-model="currentCloser"
        class="input is-black"
        type="text"
        placeholder="Seed seed phrase"
      />
    </div>
    <p class="help">
      Your secret phrase is NOT saved NOR sent anywhere. It's only used to sign
      the closer change request fee. The owner can only set the close authority
      if there is no close authority or it's the owner themselves.
    </p>
  </div>
  <div class="field">
    <label class="label">New close authority*</label>
    <div class="control">
      <input
        v-model="newCloser"
        class="input is-black"
        type="text"
        placeholder="Public Key String e.g. GsbwXfJraMomNxBcjYLcG3mxkBUiyWXAB32fGbSMQRdW"
      />
    </div>
    <p class="help">
      You can leave this field empty to remove the closer authority from the
      account
    </p>
  </div>
  <div style="display: flex" class="control is-justify-content-center mt-5">
    <button
      :class="{ 'is-loading': settingCloser }"
      class="button is-black"
      @click="onSetCloser"
    >
      Set closer
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import accountComponents from "./accountComponents";
import { setTokenAccountCloser } from "@/solana/token";

export default defineComponent({
  name: accountComponents.SetCloser,
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
    const settingCloser = ref(false);
    const accountAddress = ref("");
    const currentCloser = ref("");
    const newCloser = ref("");

    const onSetCloser = async () => {
      settingCloser.value = true;
      emit("update:accountAddress", "");
      try {
        await setTokenAccountCloser(
          payerSeedPhrase.value,
          tokenAddress.value,
          accountAddress.value,
          currentCloser.value,
          newCloser.value
        );
        emit("update:accountAddress", accountAddress.value);
      } catch (err) {
        alert(err);
      }

      settingCloser.value = false;
    };

    return {
      settingCloser,
      accountAddress,
      onSetCloser,
      currentCloser,
      newCloser
    };
  }
});
</script>
