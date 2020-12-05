<template>
  <div class="field">
    <label class="label">Account address*</label>
    <public-key-form-field v-model:address="accountAddress" />
  </div>
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
    <label class="label">Delegate*</label>
    <public-key-form-field derivePublicKey v-model:address="delegateAddress" />
  </div>
  <div class="field">
    <label class="label">Amount*</label>
    <div class="control">
      <input
        v-model="tokenAmount"
        class="input is-black"
        type="text"
        placeholder="Amount of tokens to approve e.g. 20000"
      />
    </div>
    <p class="help">
      Please be aware that a token is approved using its smallest denomination
      e.g. if you have a token with 2 decimals and you type in 200 you will
      approve 2 tokens.
    </p>
  </div>
  <div style="display: flex" class="control is-justify-content-center mt-5">
    <button
      :class="{ 'is-loading': approvingDelegate }"
      class="button is-black"
      @click="onApproveDelegate"
    >
      Approve
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import { u64 } from "@solana/spl-token";
import accountComponents from "../accountComponents";
import { approveDelegate, setTokenAccountOwner } from "@/solana/token";
import SecretFormField from "@/components/util/SecretFormField.vue";
import PublicKeyFormField from "@/components/util/PublicKeyFormField.vue";

export default defineComponent({
  name: accountComponents.Approve,
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
    const approvingDelegate = ref(false);
    const accountAddress = ref("");
    const ownerSecret = ref("");
    const ownerSignsExternally = ref(true);
    const delegateAddress = ref("");
    const tokenAmount = ref("");

    const onApproveDelegate = async () => {
      approvingDelegate.value = true;
      emit("update:accountAddress", "");
      try {
        await approveDelegate(
          payerSecret.value,
          payerSignsExternally.value,
          ownerSecret.value,
          ownerSignsExternally.value,
          accountAddress.value,
          delegateAddress.value,
          new u64(tokenAmount.value, 10)
        );
        emit("update:accountAddress", accountAddress.value);
      } catch (err) {
        approvingDelegate.value = false;
        throw err;
      }
      approvingDelegate.value = false;
    };

    return {
      approvingDelegate,
      accountAddress,
      onApproveDelegate,
      ownerSecret,
      delegateAddress,
      ownerSignsExternally,
      tokenAmount
    };
  }
});
</script>
