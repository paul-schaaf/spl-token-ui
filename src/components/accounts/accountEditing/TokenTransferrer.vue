<template>
  <div class="field">
    <label class="label">Account owner secret*</label>
    <div class="control">
      <secret-form-field
        v-model:secret="ownerAccountSecret"
        v-model:signExternally="ownerSignsExternally"
      />
    </div>
  </div>
  <div class="field">
    <label class="label">Source account*</label>
    <div class="control">
      <input
        v-model="sourceAccount"
        class="input is-black"
        type="text"
        placeholder="Public Key String e.g. GsbwXfJraMomNxBcjYLcG3mxkBUiyWXAB32fGbSMQRdW"
      />
    </div>
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
  </div>
  <div class="field">
    <label class="label">Amount*</label>
    <div class="control">
      <input
        v-model="tokenAmount"
        class="input is-black"
        type="text"
        placeholder="Tokens to send"
      />
    </div>
    <p class="help">
      Please be aware that a token is transferred using its smallest
      denomination e.g. if you have a token with 2 decimals and you type in 200
      you will transfer 2 tokens.
    </p>
  </div>
  <div style="display: flex" class="control is-justify-content-center mt-5">
    <button
      :class="{ 'is-loading': transferring }"
      class="button is-black"
      @click="onTransferTokens"
    >
      Transfer tokens
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import { transferTokens } from "@/solana/token";
import accountComponents from "../accountComponents";
import { u64 } from "@solana/spl-token";
import SecretFormField from "@/components/util/SecretFormField.vue";

export default defineComponent({
  components: { SecretFormField },
  name: accountComponents.Transfer,
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
    const ownerAccountSecret = ref("");
    const ownerSignsExternally = ref(true);

    const destinationAccount = ref("");
    const sourceAccount = ref("");
    const transferring = ref(false);
    const tokenAmount = ref("");

    const onTransferTokens = async () => {
      transferring.value = true;
      emit("update:accountAddress", "");
      try {
        await transferTokens(
          payerSecret.value,
          tokenAddress.value,
          sourceAccount.value,
          destinationAccount.value,
          ownerAccountSecret.value,
          new u64(tokenAmount.value, 10),
          payerSignsExternally.value,
          ownerSignsExternally.value
        );
        emit("update:accountAddress", destinationAccount.value);
      } catch (err) {
        transferring.value = false;
        throw err;
      }
      transferring.value = false;
    };

    return {
      destinationAccount,
      sourceAccount,
      transferring,
      onTransferTokens,
      tokenAmount,
      ownerAccountSecret,
      ownerSignsExternally
    };
  }
});
</script>
