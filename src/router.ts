import TokenCreator from "./components/tokens/TokenCreator.vue";
import TokenEditor from "./components/tokens/TokenEditor.vue";
import AccountCreator from "./components/accounts/AccountCreator.vue";
import TokenMinter from "./components/accounts/TokenMinter.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  { path: "/", name: "token-creator", component: TokenCreator },
  { path: "/token-editor", name: "token-editor", component: TokenEditor },
  {
    path: "/account-creator",
    name: "account-creator",
    component: AccountCreator
  },
  {
    path: "/token-minter",
    name: "token-minter",
    component: TokenMinter
  }
];

export default createRouter({
  history: createWebHashHistory(),
  routes
});
