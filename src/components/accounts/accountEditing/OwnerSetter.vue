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
    <label class="label">Current owner*</label>
    <div class="control">
      <secret-form-field
        v-model:secret="currentOwnerSecret"
        v-model:signExternally="currentOwnerSignsExternally"
      />
    </div>
  </div>
  <div class="field">
    <label class="label">New owner*</label>
    <div class="control">
      <input
        v-model="newOwner"
        class="input is-black"
        type="text"
        placeholder="Public Key String e.g. GsbwXfJraMomNxBcjYLcG3mxkBUiyWXAB32fGbSMQRdW"
      />
    </div>
  </div>
  <div style="display: flex" class="control is-justify-content-center mt-5">
    <button
      :class="{ 'is-loading': settingOwner }"
      class="button is-black"
      @click="onSetOwner"
    >
      Set owner
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import accountComponents from "../accountComponents";
import { setTokenAccountOwner } from "@/solana/token";
import SecretFormField from "@/components/util/SecretFormField.vue";

export default defineComponent({
  name: accountComponents.SetOwner,
  components: {
    SecretFormField
  },
  emits: ["update:accountAddress"],
  props: {
    payerSecret: {
      type: String,
      required: true
    },
    tokenAddress: {
      type: String,
      required: true
    },
    payerSignsExternally: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { emit }) {
    const { payerSecret, tokenAddress, payerSignsExternally } = toRefs(props);
    const settingOwner = ref(false);
    const accountAddress = ref("");
    const currentOwnerSecret = ref("");
    const currentOwnerSignsExternally = ref(true);
    const newOwner = ref("");

    const onSetOwner = async () => {
      settingOwner.value = true;
      emit("update:accountAddress", "");
      try {
        await setTokenAccountOwner(
          payerSecret.value,
          tokenAddress.value,
          accountAddress.value,
          currentOwnerSecret.value,
          newOwner.value,
          payerSignsExternally.value,
          currentOwnerSignsExternally.value
        );
        emit("update:accountAddress", accountAddress.value);
      } catch (err) {
        settingOwner.value = false;
        throw err;
      }
      settingOwner.value = false;
    };

    return {
      settingOwner,
      accountAddress,
      onSetOwner,
      currentOwnerSecret,
      newOwner,
      currentOwnerSignsExternally
    };
  }
});
</script>
