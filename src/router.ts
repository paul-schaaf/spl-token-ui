import { createRouter, createWebHashHistory } from "vue-router";

const TokenCreator = () => import("@/components/tokens/TokenCreator.vue");
const TokenEditor = () => import("@/components/tokens/TokenEditor.vue");
const AccountCreator = () => import("@/components/accounts/AccountCreator.vue");
const AccountEditor = () =>
  import("@/components/accounts/accountEditing/AccountEditor.vue");
const Airdrop = () => import("@/components/Airdrop.vue");

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
    path: "/airdrop",
    name: "airdrop",
    component: Airdrop
  }
];

export default createRouter({
  history: createWebHashHistory(),
  routes
});
