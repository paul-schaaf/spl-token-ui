<template>
  <div class="field">
    <label class="label">Account address*</label>
    <public-key-form-field v-model:address="accountAddress" />
  </div>
  <div class="field">
    <label class="label">Current close authority or owner*</label>
    <secret-form-field
      v-model:secret="currentCloserSecret"
      v-model:signExternally="currentCloserSignsExternally"
      externalHint=". The owner can only set the close authority if
      there is no close authority or it's the owner themselves."
      manualHint="The owner can only set the close authority if
      there is no close authority or it's the owner themselves."
    />
  </div>
  <div class="field">
    <label class="label">New close authority*</label>
    <public-key-form-field
      derivePublicKey
      v-model:address="newCloserAddress"
      hint=". You can leave this field empty to remove the closer authority from the
      account"
    />
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
import accountComponents from "../accountComponents";
import { setTokenAccountCloser } from "@/solana/token";
import SecretFormField from "@/components/util/SecretFormField.vue";
import PublicKeyFormField from "@/components/util/PublicKeyFormField.vue";

export default defineComponent({
  name: accountComponents.SetCloser,
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
    const settingCloser = ref(false);
    const accountAddress = ref("");
    const currentCloserSecret = ref("");
    const currentCloserSignsExternally = ref(true);
    const newCloserAddress = ref("");

    const onSetCloser = async () => {
      settingCloser.value = true;
      emit("update:accountAddress", "");
      try {
        await setTokenAccountCloser(
          payerSecret.value,
          accountAddress.value,
          currentCloserSecret.value,
          newCloserAddress.value,
          payerSignsExternally.value,
          currentCloserSignsExternally.value
        );
        emit("update:accountAddress", accountAddress.value);
      } catch (err) {
        settingCloser.value = false;
        throw err;
      }
      settingCloser.value = false;
    };

    return {
      settingCloser,
      accountAddress,
      onSetCloser,
      currentCloserSecret,
      newCloserAddress,
      currentCloserSignsExternally
    };
  }
});
</script>
