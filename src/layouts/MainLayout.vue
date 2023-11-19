<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          Movie App
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="center">
        <q-route-tab to="/" label="Home" />
        <q-route-tab to="/add" label="Add Movie" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { openURL } from 'quasar';

export default {
  computed: {
    title() {
      let currentPath = this.$route.path;
      switch (currentPath) {
        case '/':
          return 'Movie App';
        case '/add':
          return 'Add Movie';
        case '/edit/:movieId':
          return 'Edit Movie';
        default:
          return 'Movie App';
      }
    },
  },
  methods: {
    openURL(url: string) {
      openURL(url);
    },
  },
};
</script>

<style lang="scss" scoped></style>
