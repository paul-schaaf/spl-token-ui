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
              <router-link :to="{ name: 'token-creator' }">
                <a
                  :class="{
                    'has-background-light': 'token-creator' === $route.name,
                    'has-text-black': 'token-creator' === $route.name
                  }"
                  class="navbar-item"
                >
                  Create new token
                </a>
              </router-link>
              <router-link :to="{ name: 'token-editor' }">
                <a
                  :class="{
                    'has-background-light': 'token-editor' === $route.name,
                    'has-text-black': 'token-editor' === $route.name
                  }"
                  class="navbar-item"
                >
                  Edit existing token
                </a>
              </router-link>
            </div>
          </div>
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              Accounts
            </a>

            <div class="navbar-dropdown">
              <router-link :to="{ name: 'account-creator' }">
                <a
                  :class="{
                    'has-background-light': 'account-creator' === $route.name,
                    'has-text-black': 'account-creator' === $route.name
                  }"
                  class="navbar-item"
                >
                  Create Account
                </a>
              </router-link>
              <router-link :to="{ name: 'account-editor' }">
                <a
                  :class="{
                    'has-background-light': 'account-editor' === $route.name,
                    'has-text-black': 'account-editor' === $route.name
                  }"
                  class="navbar-item"
                >
                  Edit Account
                </a>
              </router-link>
            </div>
          </div>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <a
              id="source-code"
              href="https://github.com/paul-schaaf/spl-token-ui"
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
  <router-view></router-view>
</template>

<script lang="ts">
import { NETWORKS } from "./solana/connection";
import { changeCluster, chosenCluster } from "./solana/connection";

export default {
  name: "App",
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
}

html {
  height: 100%;
}

body {
  min-height: 100%;
}

$navbar-breakpoint: 0px;
@import "~bulma";
@import url("https://fonts.googleapis.com/css2?family=Racing+Sans+One&display=swap");

#source-code {
  color: white;
  text-decoration: none;
}
</style>
