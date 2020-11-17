<template>
  <div class="field">
    <label class="label">Account address*</label>
    <public-key-form-field v-model:address="accountAddress" />
  </div>
  <div class="field">
    <label class="label"> Owner or close authority*</label>
    <secret-form-field
      v-model:secret="ownerSecret"
      v-model:signExternally="ownerSignsExternally"
      manualHint='If there is no "close authority", the owner can
      close the account, otherwise only the "close authority" may do so.'
      externalHint='. If there is no "close authority", the owner can
      close the account, otherwise only the "close authority" may do so.'
    />
  </div>
  <div class="field">
    <label class="label">Destination account*</label>
    <public-key-form-field
      derivePublicKey
      v-model:address="destinationAccountAddress"
      hint=". This is the account that your rent reserve for the closed account gets
      sent to."
    />
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
import SecretFormField from "@/components/util/SecretFormField.vue";
import PublicKeyFormField from "@/components/util/PublicKeyFormField.vue";

export default defineComponent({
  name: accountComponents.Close,
  components: {
    SecretFormField,
    PublicKeyFormField
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
    const closingAccount = ref(false);
    const accountAddress = ref("");
    const ownerSecret = ref("");
    const ownerSignsExternally = ref(true);
    const destinationAccountAddress = ref("");

    const onCloseAccount = async () => {
      closingAccount.value = true;
      emit("update:accountAddress", "");
      try {
        await closeAccount(
          payerSecret.value,
          accountAddress.value,
          destinationAccountAddress.value,
          ownerSecret.value,
          payerSignsExternally.value,
          ownerSignsExternally.value
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
      ownerSecret,
      destinationAccountAddress,
      ownerSignsExternally
    };
  }
});
</script>
