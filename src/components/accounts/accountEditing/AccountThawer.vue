<template>
  <div class="field">
    <label class="label">Freeze authority*</label>
    <secret-form-field
      v-model:secret="freezeAuthoritySecret"
      v-model:signExternally="freezeAuthoritySignsExternally"
    />
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
import accountComponents from "../accountComponents";
import { thawAccount } from "@/solana/token";
import SecretFormField from "@/components/util/SecretFormField.vue";
export default defineComponent({
  name: accountComponents.Thaw,
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
    const thawingAccount = ref(false);
    const accountToThaw = ref("");
    const freezeAuthoritySecret = ref("");
    const freezeAuthoritySignsExternally = ref(true);

    const onThawAccount = async () => {
      thawingAccount.value = true;
      emit("update:accountAddress", "");
      try {
        await thawAccount(
          payerSecret.value,
          tokenAddress.value,
          accountToThaw.value,
          freezeAuthoritySecret.value,
          payerSignsExternally.value,
          freezeAuthoritySignsExternally.value
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
      freezeAuthoritySecret,
      freezeAuthoritySignsExternally
    };
  }
});
</script>
