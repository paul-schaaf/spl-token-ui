<template>
  <input v-model="mnemonic" type="text" />
  <input type="submit" @click="updateBalance" />
  <div>Balance: {{ balance ?? "--" }}</div>
</template>

<script lang="ts">
import { Ref, ref } from "vue";
import { getBalance } from "../solana/account";

export default {
  setup() {
    const mnemonic = ref("");
    const balance: Ref<number | null> = ref(null);

    const updateBalance = async () => {
      balance.value = await getBalance(mnemonic.value);
    };

    return { mnemonic, balance, updateBalance };
  }
};
</script>
