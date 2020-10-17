<template>
  <input v-model="mnemonic" type="text" />
  <input
    type="submit"
    @click="updateBalance"
    :disabled="balanceState === 'LOADING'"
  />
  <div>Balance: {{ balance ?? "--" }}</div>
  <input
    type="submit"
    value="Create new token"
    @click="onCreateNewToken"
    :disabled="createNewTokenState === 'LOADING'"
  />
  <div>Mint account: {{ mintAccount ?? "--" }}</div>
</template>

<script lang="ts">
import { Ref, ref } from "vue";
import { getBalance, createAccount } from "../solana/account";
import { createNewToken } from "../solana/token";

type LoadingState = "STANDBY" | "LOADING";

export default {
  setup() {
    const mnemonic = ref("");
    const balance: Ref<number | null> = ref(null);
    const mintAccount: any = ref(null);
    const balanceState: Ref<LoadingState> = ref("STANDBY");
    const createNewTokenState: Ref<LoadingState> = ref("STANDBY");

    const updateBalance = async () => {
      balanceState.value = "LOADING";
      balance.value = await getBalance(mnemonic.value);
      balanceState.value = "STANDBY";
    };

    const onCreateNewToken = async () => {
      createNewTokenState.value = "LOADING";
      mintAccount.value = await createNewToken(
        await createAccount(mnemonic.value)
      );
      createNewTokenState.value = "STANDBY";
    };

    return {
      mnemonic,
      balance,
      updateBalance,
      onCreateNewToken,
      mintAccount,
      balanceState,
      createNewTokenState
    };
  }
};
</script>
