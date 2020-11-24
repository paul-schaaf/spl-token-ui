<template>
  <div class="field">
    <label class="label">Faucet address*</label>
    <public-key-form-field v-model:address="faucetAddress" />
  </div>
  <div style="display: flex" class="control is-justify-content-center mt-5">
    <button
      :class="{ 'is-loading': inspectingFaucet }"
      class="button is-black"
      @click="onInspectFaucet"
    >
      Inspect faucet
    </button>
  </div>
  <div v-if="faucetInfo" style="margin-top: 25px">
    <p><strong>FaucetKey: </strong> {{ faucetInfo.faucetKey }}</p>
    <p><strong>MintKey: </strong> {{ faucetInfo.mintPubkey }}</p>
    <p>
      <strong>AdminKey: </strong> {{ faucetInfo.adminKey || "No admin key" }}
    </p>
    <p><strong>PermittedAmount: </strong> {{ faucetInfo.permittedAmount }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "vue";
import PublicKeyFormField from "@/components/util/PublicKeyFormField.vue";
import { inspectFaucet } from "@/solana/token";
export default defineComponent({
  components: {
    PublicKeyFormField
  },
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
  emits: ["update:accountAddress"],
  setup(_, { emit }) {
    const faucetAddress = ref("");
    const inspectingFaucet = ref(false);
    const faucetInfo: Ref<null | {
      faucetKey: string;
      mintPubkey: string;
      adminKey: string | undefined;
      permittedAmount: string;
    }> = ref(null);
    const onInspectFaucet = async () => {
      emit("update:accountAddress", "");
      inspectingFaucet.value = true;
      faucetInfo.value = null;
      try {
        faucetInfo.value = await inspectFaucet(faucetAddress.value);
      } catch (err) {
        inspectingFaucet.value = false;
        throw err;
      }
      inspectingFaucet.value = false;
    };
    return { faucetAddress, inspectingFaucet, onInspectFaucet, faucetInfo };
  }
});
</script>
