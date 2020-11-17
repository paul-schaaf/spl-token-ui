<template>
  <div class="field">
    <label class="label">Account owner*</label>
    <secret-form-field
      v-model:secret="ownerAccountSecret"
      v-model:signExternally="ownerSignsExternally"
    />
  </div>
  <div class="field">
    <label class="label">Account address*</label>
    <public-key-form-field v-model:address="accountAddress" />
  </div>
  <div class="field">
    <label class="label">Amount*</label>
    <div class="control">
      <input
        v-model="tokenAmount"
        class="input is-black"
        type="text"
        placeholder="Tokens to burn"
      />
    </div>
    <p class="help">
      Please be aware that a token is burned using its smallest denomination
      e.g. if you have a token with 2 decimals and you type in 200 you will burn
      2 tokens.
    </p>
  </div>
  <div style="display: flex" class="control is-justify-content-center mt-5">
    <button
      :class="{ 'is-loading': burningTokens }"
      class="button is-black"
      @click="onBurnTokens"
    >
      Burn tokens
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import { burnTokens } from "@/solana/token";
import accountComponents from "../accountComponents";
import { u64 } from "@solana/spl-token";
import SecretFormField from "@/components/util/SecretFormField.vue";
import PublicKeyFormField from "@/components/util/PublicKeyFormField.vue";

export default defineComponent({
  name: accountComponents.Burn,
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
    const ownerAccountSecret = ref("");
    const ownerSignsExternally = ref(true);
    const accountAddress = ref("");
    const burningTokens = ref(false);
    const tokenAmount = ref("");

    const onBurnTokens = async () => {
      burningTokens.value = true;
      emit("update:accountAddress", "");
      try {
        await burnTokens(
          payerSecret.value,
          accountAddress.value,
          ownerAccountSecret.value,
          new u64(tokenAmount.value, 10),
          payerSignsExternally.value,
          ownerSignsExternally.value
        );
        emit("update:accountAddress", accountAddress.value);
      } catch (err) {
        burningTokens.value = false;
        throw err;
      }
      burningTokens.value = false;
    };

    return {
      burningTokens,
      tokenAmount,
      ownerAccountSecret,
      accountAddress,
      onBurnTokens,
      ownerSignsExternally
    };
  }
});
</script>
