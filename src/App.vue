<template>
  <template v-if="!isOnMobile"
    ><nav
      class="navbar is-black"
      role="navigation"
      aria-label="main navigation"
    >
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
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">
                Airdrops
              </a>
              <div class="navbar-dropdown">
                <p
                  class="navbar-item"
                  style="margin-bottom: 5px; padding: 0 0 0 16px; font-size: 13px"
                >
                  <strong>SOL</strong>
                </p>
                <router-link :to="{ name: 'sol-airdrop' }">
                  <a
                    :class="{
                      'has-background-light': 'sol-airdrop' === $route.name,
                      'has-text-black': 'sol-airdrop' === $route.name
                    }"
                    class="navbar-item"
                  >
                    SOL Airdrop
                  </a>
                </router-link>
                <p
                  class="navbar-item"
                  style="margin-bottom: 5px;padding: 6px 0 0 16px;font-size: 13px"
                >
                  <strong>TOKENS</strong>
                </p>
                <router-link :to="{ name: 'faucet-creator' }">
                  <a
                    :class="{
                      'has-background-light': 'faucet-creator' === $route.name,
                      'has-text-black': 'faucet-creator' === $route.name
                    }"
                    class="navbar-item"
                  >
                    Create Faucet
                  </a>
                </router-link>
                <router-link :to="{ name: 'token-airdrop' }">
                  <a
                    :class="{
                      'has-background-light': 'token-airdrop' === $route.name,
                      'has-text-black': 'token-airdrop' === $route.name
                    }"
                    class="navbar-item"
                  >
                    Token Airdrop
                  </a>
                </router-link>
              </div>
            </div>
          </div>
          <div class="navbar-end">
            <div class="navbar-item">
              <a
                id="source-code"
                href="https://github.com/paul-schaaf/spl-token-ui/blob/main/README.md#faq"
                target="_blank"
                rel="noopener noreferrer"
                >FAQ</a
              >
            </div>
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
              <a class="navbar-link"> {{ currentClusterWithEmoji }} </a>

              <div class="navbar-dropdown is-right">
                <a
                  v-for="cluster in CLUSTERS"
                  :key="cluster"
                  :class="{
                    'has-background-light': cluster === chosenCluster,
                    'has-text-black': cluster === chosenCluster
                  }"
                  class="navbar-item"
                  @click="changeCluster(cluster)"
                  >{{ cluster }}</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <div style="display: flex" class="is-justify-content-center">
      <div style="width: 650px; margin-bottom: 40px" class="mt-6">
        <router-view></router-view>
      </div>
    </div>
  </template>

  <p v-else>
    This app does not work on phones. Please switch to a device with a larger
    screen.
  </p>
</template>

<script lang="ts">
import { computed } from "vue";
import { CLUSTERS } from "./solana/connection";
import { changeCluster, chosenCluster } from "./solana/connection";

export default {
  name: "App",
  setup() {
    changeCluster(chosenCluster.value);

    const isOnMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    const currentClusterWithEmoji = computed(() => {
      let emoji;
      switch (chosenCluster.value) {
        case "mainnet-beta":
          emoji = "🚀";
          break;
        case "testnet":
          emoji = "🧪";
          break;
        case "devnet":
          emoji = "🥏";
          break;
        case "localnet":
          emoji = "🏠";
          break;
      }
      return chosenCluster.value + " " + emoji;
    });

    return {
      CLUSTERS,
      chosenCluster,
      changeCluster,
      isOnMobile,
      currentClusterWithEmoji
    };
  }
};
</script>

<style lang="scss">
body,
html {
  background: rgb(240, 240, 240);
  // removing the scrollbar
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
  ::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
}

html {
  height: 100%;
}

body {
  min-height: 100%;
}

$navbar-breakpoint: 0px;
@import "~bulma";

#source-code {
  color: white;
  text-decoration: none;
}
</style>
