<template>
  <div>
    <div
      class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm"
    >
      <img
        @click.prevent="toHome"
        src="../assets/台化logo.png"
        height="60"
        width="90"
        class="btn"
      />

      <h1 class="my-0 mr-md-auto font-weight-normal text-center">
        台化施工相片比對系統
      </h1>
      <h5 class="mr-3 mt-1">{{ username }} </h5>
      <a v-if="username == 'admin'" class="btn btn-outline-primary" @click.prevent="toUser">管理</a>
      <a class="btn btn-outline-danger" @click.prevent="logout">登出</a>
    </div>
  </div>
</template>

<script>
import { getCookie, delCookie } from "../assets/js/cookie";

export default {
  data() {
    return {
      username:''
    };
  },
  methods: {
    logout() {
      delCookie("username");
      this.$router.push("/login");
    },
    toHome() {
      this.$router.push("/bolt");
    },
    toUser() {
      this.$router.push("/user");
    },
  },
  mounted() {
    this.username = getCookie("username");
  },
};
</script>