<template>
  <div>
    <Navbar />
    <div class="container">
      <h1>管理使用者</h1>
      <br />
      <button
        type="button"
        class="btn btn-success"
        @click="openUpdateModal(true)"
      >
        新增使用者
      </button>
      <br />
      <br />
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">NoteID</th>
            <th scope="col">密碼</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in userList"
            :key="index"
            v-show="item.username != 'admin'"
          >
            <td>{{ index }}</td>
            <td>{{ item.username }}</td>
            <td>{{ item.password }}</td>
            <td>
              <button
                type="button"
                class="btn btn-warning btn-sm"
                @click="openUpdateModal(false, item)"
              >
                修改
              </button>
              <button
                type="button"
                class="btn btn-danger btn-sm"
                @click="openDeleteModal(item)"
              >
                刪除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import { getCookie, delCookie } from "../assets/js/cookie";

export default {
  data() {
    return {
      userList: [],
    };
  },
  created() {
    let uname = getCookie("username");
    if (uname == "") {
      this.$router.push("/login");
    }
  },
  mounted() {
    axios.get("/api/admin").then((res) => {
      this.userList = res.data;
    });
  },
  methods: {
  },
  components: {
    Navbar,
    Footer,
  },
};
</script>