<template>
  <div class="field">
    <label class="label">Freeze authority*</label>
    <secret-form-field
      v-model:secret="freezeAuthoritySecret"
      v-model:signExternally="freezeAuthoritySignsExternally"
    />
  </div>
  <div class="field">
    <label class="label">Account to freeze*</label>
    <div class="control">
      <input
        v-model="accountToFreezeAddress"
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
import accountComponents from "../accountComponents";
import { freezeAccount } from "@/solana/token";
import SecretFormField from "@/components/util/SecretFormField.vue";

export default defineComponent({
  name: accountComponents.Freeze,
  components: {
    SecretFormField
  },
  emits: ["update:accountAddress"],
  props: {
    payerSecret: {
      type: String,
      required: true
    },

    payerSignsExternally: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { emit }) {
    const { payerSecret, payerSignsExternally } = toRefs(props);
    const freezingAccount = ref(false);
    const accountToFreezeAddress = ref("");
    const freezeAuthoritySecret = ref("");
    const freezeAuthoritySignsExternally = ref(true);

    const onFreezeAccount = async () => {
      freezingAccount.value = true;
      emit("update:accountAddress", "");
      try {
        await freezeAccount(
          payerSecret.value,
          accountToFreezeAddress.value,
          freezeAuthoritySecret.value,
          payerSignsExternally.value,
          freezeAuthoritySignsExternally.value
        );
        emit("update:accountAddress", accountToFreezeAddress.value);
      } catch (err) {
        freezingAccount.value = false;
        throw err;
      }
      freezingAccount.value = false;
    };

    return {
      freezingAccount,
      accountToFreezeAddress,
      onFreezeAccount,
      freezeAuthoritySecret,
      freezeAuthoritySignsExternally
    };
  }
});
</script>
