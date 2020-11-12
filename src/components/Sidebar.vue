<template>
  <nav class="col-md-2 d-none d-md-block bg-light sidebar">
    <div class="sidebar-sticky">
      <h6
        class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
      >
        <span>選項</span>
        <!-- <a class="d-flex align-items-center text-muted" href="#">
          <span data-feather="plus-circle"></span>
        </a> -->
      </h6>
      <ul class="nav flex-column mb-2">
        <li class="nav-item" v-if="username == 'admin'">
          <a class="nav-link" href="#" @click="toUser">
            <font-awesome-icon icon="users" />
            <span data-feather="file-text"></span>
            使用者
          </a>
        </li>
        <li class="nav-item" @click="toImageData" v-if="username == 'admin'">
          <a class="nav-link" href="#">
            <font-awesome-icon icon="images" />
            <span data-feather="file-text"></span>
            相片資料庫
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" @click="toUploadRecord">
            <font-awesome-icon icon="file-upload" />
            <span data-feather="file-text"></span>
            檔案上傳紀錄
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
import axios from "axios";

import { setCookie, getCookie } from "../assets/js/cookie";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default {
  data() {
    return {
      username: "",
      showTishi: false,
    };
  },
  methods: {
    toUser() {
      this.$router.push("/user");
    },
    toImageData() {
      this.$router.push("/image");
    },
    toUploadRecord() {
      this.$router.push("/uploadrecord");
    },
  },
  mounted() {
    this.username = getCookie("username");
  },
};
</script>