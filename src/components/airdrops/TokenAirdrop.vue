<template>
  <div class="field">
    <label class="label">Admin</label>
    <secret-form-field
      v-model:secret="adminSecret"
      v-model:signExternally="adminSignsExternally"
      manualHint="You can leave this field empty if you're not the admin of the faucet."
    />
  </div>
  <div class="field">
    <label class="label">Token destination address*</label>
    <public-key-form-field v-model:address="addressToAirdrop" />
  </div>
  <div class="field">
    <label class="label">Faucet address*</label>
    <public-key-form-field v-model:address="faucetAddress" />
  </div>
  <div class="field">
    <label class="label">Amount*</label>
    <div class="control">
      <input
        v-model="tokenAmount"
        :onkeyup="
          () => {
            if (tokenAmount < 0) {
              tokenAmount *= -1;
            }
          }
        "
        class="input is-black"
        type="text"
        placeholder="Amount of tokens to airdrop"
      />
    </div>
  </div>
  <div style="display: flex" class="control is-justify-content-center mt-5">
    <button
      :class="{ 'is-loading': airdroppingTokens }"
      class="button is-black"
      @click="onAirdropTokens"
    >
      Airdrop tokens
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import { airdropTokens } from "@/solana/token";
import SecretFormField from "@/components/util/SecretFormField.vue";
import PublicKeyFormField from "@/components/util/PublicKeyFormField.vue";
import { u64 } from "@solana/spl-token";
import tokenFaucetComponents from "./tokenFaucetComponents";

export default defineComponent({
  name: tokenFaucetComponents.TokenAirdrop,
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
    const adminSignsExternally = ref(false);
    const addressToAirdrop = ref("");
    const tokenAmount = ref("");
    const faucetAddress = ref("");

    const airdroppingTokens = ref(false);

    const onAirdropTokens = async () => {
      airdroppingTokens.value = true;
      emit("update:accountAddress", "");
      try {
        const address = await airdropTokens(
          payerSecret.value,
          payerSignsExternally.value,
          faucetAddress.value,
          addressToAirdrop.value,
          adminSecret.value,
          adminSignsExternally.value,
          new u64(tokenAmount.value, 10)
        );
        emit("update:accountAddress", address);
      } catch (err) {
        airdroppingTokens.value = false;
        throw err;
      }
      airdroppingTokens.value = false;
    };

    return {
      adminSecret,
      airdroppingTokens,
      adminSignsExternally,
      tokenAmount,
      addressToAirdrop,
      onAirdropTokens,
      faucetAddress
    };
  }
});
</script>
