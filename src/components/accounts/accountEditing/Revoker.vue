<template>
  <div class="field">
    <label class="label">Owner*</label>
    <div class="control">
      <secret-form-field
        v-model:secret="ownerSecret"
        v-model:signExternally="ownerSignsExternally"
      />
    </div>
  </div>
  <div class="field">
    <label class="label">Account address*</label>
    <public-key-form-field v-model:address="accountAddress" />
  </div>
  <div style="display: flex" class="control is-justify-content-center mt-5">
    <button
      :class="{ 'is-loading': revoking }"
      class="button is-black"
      @click="onRevoke"
    >
      Revoke
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import accountComponents from "../accountComponents";
import { revoke } from "@/solana/token";
import SecretFormField from "@/components/util/SecretFormField.vue";
import PublicKeyFormField from "@/components/util/PublicKeyFormField.vue";

export default defineComponent({
  name: accountComponents.Revoke,
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
    const revoking = ref(false);
    const accountAddress = ref("");
    const ownerSecret = ref("");
    const ownerSignsExternally = ref(true);

    const onRevoke = async () => {
      revoking.value = true;
      emit("update:accountAddress", "");
      try {
        await revoke(
          payerSecret.value,
          payerSignsExternally.value,
          ownerSecret.value,
          ownerSignsExternally.value,
          accountAddress.value
        );
        emit("update:accountAddress", accountAddress.value);
      } catch (err) {
        revoking.value = false;
        throw err;
      }
      revoking.value = false;
    };

    return {
      revoking,
      accountAddress,
      onRevoke,
      ownerSecret,
      ownerSignsExternally
    };
  }
});
</script>
