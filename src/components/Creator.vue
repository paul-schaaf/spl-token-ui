<template>
  <input v-model="mnemonic" type="text" />
  <input type="submit" @click="updateBalance" :disabled="state !== 'STANDBY'" />
  <div>Balance: {{ balance ?? "--" }}</div>
  <input
    type="submit"
    value="Create new token"
    @click="onCreateNewToken"
    :disabled="state !== 'STANDBY'"
  />
  <div>Mint account: {{ mintAccount ?? "--" }}</div>
</template>

<script lang="ts">
import { Ref, ref } from "vue";
import { getBalance, createAccount } from "../solana/account";
import { createNewToken } from "../solana/token";

type State = "STANDBY" | "CREATING_TOKEN" | "GETTING_BALANCE";

export default {
  setup() {
    const mnemonic = ref("");
    const balance: Ref<number | null> = ref(null);
    const mintAccount: any = ref(null);
    const state: Ref<State> = ref("STANDBY");

    const updateBalance = async () => {
      state.value = "GETTING_BALANCE";
      balance.value = await getBalance(mnemonic.value);
      state.value = "STANDBY";
    };

    const onCreateNewToken = async () => {
      state.value = "CREATING_TOKEN";
      mintAccount.value = await createNewToken(
        await createAccount(mnemonic.value)
      );
      state.value = "STANDBY";
    };

    return {
      mnemonic,
      balance,
      updateBalance,
      onCreateNewToken,
      mintAccount,
      state
    };
  }
};
</script>
