<template>
  <nav class="navbar is-black" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-menu">
        <div class="navbar-start">
          <a class="navbar-item">
            <strong>SPL TOKEN UI</strong>
          </a>
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              Tokens
            </a>

            <div class="navbar-dropdown">
              <a class="navbar-item">
                Create new Token
              </a>
              <a class="navbar-item">
                Edit Existing Token
              </a>
            </div>
          </div>
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              Accounts
            </a>

            <div class="navbar-dropdown">
              <a class="navbar-item">
                Initialize Account
              </a>

              <a class="navbar-item">
                Freeze Account
              </a>
              <a class="navbar-item">
                Thaw Account
              </a>
              <hr class="navbar-divider" />

              <a class="navbar-item">
                Mint to Account
              </a>
              <a class="navbar-item">
                Burn from Account
              </a>
              <a class="navbar-item">
                Transfer
              </a>
            </div>
          </div>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <a
              id="source-code"
              href="https://github.com/paul-schaaf/spl-token-creator"
              target="_blank"
              rel="noopener noreferrer"
              >source code</a
            >
          </div>
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              {{ chosenCluster }}
            </a>

            <div class="navbar-dropdown">
              <a
                v-for="network in NETWORKS"
                :key="network"
                :class="{
                  'has-background-light': network === chosenCluster,
                  'has-text-black': network === chosenCluster
                }"
                class="navbar-item"
                @click="changeCluster(network)"
                >{{ network }}</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <TokenCreator />
  <TokenEditor />
</template>

<script lang="ts">
import TokenCreator from "./components/TokenCreator.vue";
import TokenEditor from "./components/TokenEditor.vue";
import { NETWORKS } from "./solana/connection";
import { changeCluster, chosenCluster } from "./solana/connection";

export default {
  name: "App",
  components: {
    TokenCreator,
    TokenEditor
  },
  setup() {
    changeCluster(chosenCluster.value);

    return { NETWORKS, chosenCluster, changeCluster };
  }
};
</script>

<style lang="scss">
body,
html {
  background: rgb(240, 240, 240);
  height: 100%;
}
$navbar-breakpoint: 0px;
@import "~bulma";
@import url("https://fonts.googleapis.com/css2?family=Racing+Sans+One&display=swap");

#source-code {
  color: white;
  text-decoration: none;
}
</style>
