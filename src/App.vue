<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
<style lang="scss" scoped>
body, .v-application {
  color: $pr_text;
  font-size: 14px;
  max-width: 980px;
  margin: 50px auto 20px;
  &.theme--light {
    color: $pr_text;
  }
}
</style>