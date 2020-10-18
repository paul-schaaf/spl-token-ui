<template>
  <input v-model="mnemonic" type="text" />
  <input
    :disabled="balanceState === 'LOADING'"
    type="submit"
    value="Get balance"
    @click="updateBalance"
  />
  <div>Balance: {{ balance ?? "--" }}</div>
  <input
    :disabled="createNewTokenState === 'LOADING'"
    type="submit"
    value="Create new token"
    @click="onCreateNewToken"
  />
  <div>Mint account: {{ mintAccount ?? "--" }}</div>
  <input
    :disabled="createNewTokenAccountState === 'LOADING'"
    type="submit"
    value="Create new token account"
    @click="onCreateNewTokenAccount"
  />
  <div>Token Accounts:</div>
  <div v-for="(acc, index) in tokenAccounts" :key="acc.value.publicKey">
    Account: {{ acc.value.publicKey }}, Balance:
    {{
      `${
        acc.value.balance === null
          ? "--"
          : tokenAmountToString(acc.value.balance, 4)
      }`
    }}
    <input
      :disabled="mintTokensState === 'LOADING'"
      type="Submit"
      value="Mint Tokens"
      @click="onMintTokens(index)"
    />
  </div>
</template>

<script lang="ts">
import { Ref, ref } from "vue";
import { getBalance, createAccount } from "../solana/account";
import {
  createNewToken,
  createNewTokenAccount,
  getTokenBalance,
  mintToken
} from "../solana/token";
import { PublicKey } from "@solana/web3.js";
import { u64 } from "@solana/spl-token";
import { sleep } from "../utils/sleep";
import { tokenAmountToString } from "../utils/numbers";

type LoadingState = "STANDBY" | "LOADING";

interface TokenAccount {
  publicKey: string;
  balance: u64 | null;
}

export default {
  setup() {
    const mnemonic = ref("");
    const balance: Ref<number | null> = ref(null);
    const mintAccount: Ref<string | null> = ref(null);
    const tokenAccounts: Ref<Ref<TokenAccount>[]> = ref([]);

    const balanceState: Ref<LoadingState> = ref("STANDBY");
    const createNewTokenState: Ref<LoadingState> = ref("STANDBY");
    const createNewTokenAccountState: Ref<LoadingState> = ref("STANDBY");
    const mintTokensState: Ref<LoadingState> = ref("STANDBY");

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
      tokenAccounts.value = [];
      createNewTokenState.value = "STANDBY";
    };

    const onCreateNewTokenAccount = async () => {
      createNewTokenAccountState.value = "LOADING";

      const myAccount = await createAccount(mnemonic.value);
      const newTokenAccount = await createNewTokenAccount(myAccount.publicKey);
      tokenAccounts.value.push(
        ref({
          publicKey: newTokenAccount.toString(),
          balance: null
        })
      );
      createNewTokenAccountState.value = "STANDBY";
    };

    const onMintTokens = async (tokenIndex: number) => {
      mintTokensState.value = "LOADING";
      const tokenAccount = new PublicKey(
        tokenAccounts.value[tokenIndex].value.publicKey
      );
      await mintToken(
        tokenAccount,
        (await createAccount(mnemonic.value)).publicKey
      );
      await sleep();
      tokenAccounts.value[tokenIndex].value.balance = await getTokenBalance(
        tokenAccount
      );
      mintTokensState.value = "STANDBY";
    };

    return {
      mnemonic,
      balance,
      updateBalance,
      onCreateNewToken,
      mintAccount,
      balanceState,
      createNewTokenState,
      onCreateNewTokenAccount,
      createNewTokenAccountState,
      tokenAccounts,
      onMintTokens,
      mintTokensState,
      tokenAmountToString
    };
  }
};
</script>
