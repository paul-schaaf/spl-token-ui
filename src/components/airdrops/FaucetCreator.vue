<template>
  <div class="field">
    <label class="label">Current mint authority*</label>
    <secret-form-field
      v-model:secret="currentAuthoritySecret"
      v-model:signExternally="mintAuthoritySignsExternally"
    />
  </div>
  <div class="field">
    <label class="label">Token mint address*</label>
    <div class="control">
      <input
        v-model="tokenMintAddress"
        class="input is-black"
        type="text"
        placeholder="Token address e.g. GsbwXfJraMomNxBcjYLcG3mxkBUiyWXAB32fGbSMQRdW"
      />
    </div>
  </div>
  <div class="field">
    <label class="label">Admin address</label>
    <public-key-form-field
      derivePublicKey
      v-model:address="adminAddress"
      hint=". You don't have to specify an admin address. If you do, the admin will be able to airdrop themselves any amount of tokens, ignoring the limit you set below."
    />
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
        placeholder="Max tokens that may be airdropped to non-admins per ix"
      />
    </div>
    <p class="help">
      <span
        ><strong @click="setNoLimitAmount" class="is-clickable"
          >Set no limit.</strong
        ></span
      >
      Max tokens that may be airdropped to non-admins per ix. Please be aware
      that you need to use a token's smallest denomination e.g. if you have a
      token with 2 decimals and you type in 200 you will allow users to get 2
      tokens per ix.
    </p>
  </div>
  <div style="display: flex" class="control is-justify-content-center mt-5">
    <button
      :class="{ 'is-loading': creatingFaucet }"
      class="button is-black"
      @click="onCreateFaucet"
    >
      Create new faucet
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import { createFaucet } from "@/solana/token";
import SecretFormField from "@/components/util/SecretFormField.vue";
import PublicKeyFormField from "@/components/util/PublicKeyFormField.vue";
import { u64 } from "@solana/spl-token";
import tokenFaucetComponents from "./tokenFaucetComponents";

export default defineComponent({
  name: tokenFaucetComponents.CreateFaucet,
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
    const currentAuthoritySecret = ref("");
    const mintAuthoritySignsExternally = ref(true);
    const tokenMintAddress = ref("");
    const adminAddress = ref("");
    const tokenAmount = ref("");

    const creatingFaucet = ref(false);

    const setNoLimitAmount = () => {
      tokenAmount.value = new u64([
        255,
        255,
        255,
        255,
        255,
        255,
        255,
        255
      ]).toString(10);
    };

    const onCreateFaucet = async () => {
      creatingFaucet.value = true;
      emit("update:accountAddress", "");
      try {
        const address = await createFaucet(
          payerSecret.value,
          payerSignsExternally.value,
          currentAuthoritySecret.value,
          mintAuthoritySignsExternally.value,
          tokenMintAddress.value,
          adminAddress.value,
          new u64(tokenAmount.value, 10)
        );
        emit("update:accountAddress", address);
      } catch (err) {
        creatingFaucet.value = false;
        throw err;
      }
      creatingFaucet.value = false;
    };

    return {
      currentAuthoritySecret,
      creatingFaucet,
      mintAuthoritySignsExternally,
      tokenAmount,
      setNoLimitAmount,
      tokenMintAddress,
      adminAddress,
      onCreateFaucet
    };
  }
});
</script>
