<template>
  <div>
    <div
      class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm"
    >
      <img src="../assets/台化logo.png" height="60" width="90"><h1 class="my-0 mr-md-auto font-weight-normal text-center">施工相片比對系統</h1>
      <a class="btn btn-outline-primary" @click.prevent="logout">登出</a>
    </div>
  </div>
</template>

<script>
import { getCookie, delCookie } from "../assets/js/cookie";

export default {
  methods: {
    logout() {
      delCookie("username");
      this.$router.push("/login");
    },
  },
};
</script>