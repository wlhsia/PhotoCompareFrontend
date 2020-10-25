<template>
  <nav class="col-md-2 d-none d-md-block bg-light sidebar">
    <div class="sidebar-sticky">
      <h6
        class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
      >
        <span>選項</span>
        <a class="d-flex align-items-center text-muted" href="#">
          <span data-feather="plus-circle"></span>
        </a>
      </h6>
      <ul class="nav flex-column mb-2">
        <li class="nav-item">
          <a class="nav-link" href="#" @click="toUser">
            <span data-feather="file-text"></span>
            使用者
          </a>
        </li>
        <li class="nav-item" @click="toImageData">
          <a class="nav-link" href="#">
            <span data-feather="file-text"></span>
            相片資料庫
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">
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
    toImageData(){
    this.$router.push("/image");
    },

  },
};
</script>