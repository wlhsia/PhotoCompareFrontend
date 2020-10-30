<template>
  <div>
    <Navbar />
    <div class="container-fluid">
      <div class="row">
        <Sidebar />
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <h3>檔案上傳紀錄</h3>
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">上傳時間</th>
                <th scope="col">上傳檔案</th>
                <th scope="col">上傳人員</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in uploadRecordList" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.time }}</td>
                <td>{{ item.fileName }}</td>
                <td>{{ item.uploadUser }}</td>
              </tr>
            </tbody>
          </table>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";

import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import Footer from "@/components/Footer.vue";
import { setCookie, getCookie, delCookie } from "../assets/js/cookie.js";

export default {
  data() {
    return {
      uploadRecordList: [],
    };
  },
  created() {
    let uname = getCookie("username");
    if (uname == "") {
      this.$router.push("/login");
    } else if (uname != "admin") {
      this.$router.push("/");
    }
  },
  mounted() {
    this.getUploadRecord();
  },
  methods: {
    getUploadRecord() {
      axios.get("/api/uploadrecord").then((res) => {
        this.uploadRecordList = res.data.uploadRecordList;
      });
    },
  },
  components: {
    Navbar,
    Sidebar,
  },
};
</script>