<template>
  <nav class="navbar is-black" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div class="container">
      <div class="navbar-menu">
        <div class="navbar-start">
          <a class="navbar-item">
            <strong>SPL MINTER</strong>
          </a>
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              Mints
            </a>

            <div class="navbar-dropdown">
              <a class="navbar-item">
                Create new Mint
              </a>
              <a class="navbar-item">
                Edit Existing Mint
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
      </div>
    </div>
  </nav>
  <!-- <Creator /> -->
</template>

<script lang="ts">
export default {
  name: "App"
};
</script>

<style>
body,
html {
  background: rgb(238, 238, 238);
  height: 100%;
}
</style>
