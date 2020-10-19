import TokenCreator from "./components/TokenCreator.vue";
import TokenEditor from "./components/TokenEditor.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  { path: "/", name: "token-creator", component: TokenCreator },
  { path: "/token-editor", name: "token-editor", component: TokenEditor }
];

export default createRouter({
  history: createWebHashHistory(),
  routes
});
