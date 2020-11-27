<template>
  <div class="field">
    <label class="label">Faucet Admin*</label>
    <secret-form-field
      v-model:secret="adminSecret"
      v-model:signExternally="adminSignsExternally"
    />
  </div>
  <div class="field">
    <label class="label">Faucet address*</label>
    <public-key-form-field v-model:address="faucetAddress" />
  </div>
  <div class="field">
    <label class="label">Rent destination address*</label>
    <public-key-form-field
      derivePublicKey
      v-model:address="rentDestinationAddress"
      hint=". Account receiving the rent that has been deposited for the faucet account"
    />
  </div>
  <div style="display: flex" class="control is-justify-content-center mt-5">
    <button
      :class="{ 'is-loading': closingFaucet }"
      class="button is-black"
      @click="onCloseFaucet"
    >
      Closet faucet
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import { closeFaucet } from "@/solana/token";
import SecretFormField from "@/components/util/SecretFormField.vue";
import PublicKeyFormField from "@/components/util/PublicKeyFormField.vue";
import tokenFaucetComponents from "./tokenFaucetComponents";

export default defineComponent({
  name: tokenFaucetComponents.CloseFaucet,
  emits: ["update:accountAddress"],
  components: {
    SecretFormField,
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
  setup(props, { emit }) {
    const { payerSecret, payerSignsExternally } = toRefs(props);
    const adminSecret = ref("");
    const adminSignsExternally = ref(true);
    const faucetAddress = ref("");
    const rentDestinationAddress = ref("");

    const closingFaucet = ref(false);

    const onCloseFaucet = async () => {
      closingFaucet.value = true;
      emit("update:accountAddress", "");
      try {
        const address = await closeFaucet(
          payerSecret.value,
          payerSignsExternally.value,
          adminSecret.value,
          adminSignsExternally.value,
          faucetAddress.value,
          rentDestinationAddress.value
        );
        emit("update:accountAddress", address);
      } catch (err) {
        closingFaucet.value = false;
        throw err;
      }
      closingFaucet.value = false;
    };

    return {
      adminSecret,
      closingFaucet,
      adminSignsExternally,
      onCloseFaucet,
      faucetAddress,
      rentDestinationAddress
    };
  }
});
</script>
