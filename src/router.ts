import { createRouter, createWebHashHistory } from "vue-router";

const TokenCreator = () => import("@/components/tokens/TokenCreator.vue");
const TokenEditor = () => import("@/components/tokens/TokenEditor.vue");
const AccountCreator = () => import("@/components/accounts/AccountCreator.vue");
const AccountEditor = () =>
  import("@/components/accounts/accountEditing/AccountEditor.vue");
const Airdrop = () => import("@/components/airdrops/Airdrop.vue");
const FaucetCreator = () => import("@/components/airdrops/FaucetCreator.vue");
const FaucetCloser = () => import("@/components/airdrops/FaucetCloser.vue");
const TokenAirdrop = () => import("@/components/airdrops/TokenAirdrop.vue");

const routes = [
  { path: "/", name: "token-creator", component: TokenCreator },
  { path: "/token-editor", name: "token-editor", component: TokenEditor },
  {
    path: "/account-creator",
    name: "account-creator",
    component: AccountCreator
  },
  {
    path: "/account-editor",
    name: "account-editor",
    component: AccountEditor
  },
  {
    path: "/sol-airdrop",
    name: "sol-airdrop",
    component: Airdrop
  },
  {
    path: "/faucet-creator",
    name: "faucet-creator",
    component: FaucetCreator
  },
  {
    path: "/faucet-closer",
    name: "faucet-closer",
    component: FaucetCloser
  },
  {
    path: "/token-airdrop",
    name: "token-airdrop",
    component: TokenAirdrop
  }
];

export default createRouter({
  history: createWebHashHistory(),
  routes
});
