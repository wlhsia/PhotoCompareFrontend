<template>
  <div>
    <!-- <Navbar /> -->
    <div class="container">
      <h1 class="display-4 text-center mt-5">台化施工相片重複比對系統</h1>
      <div class="row">
        <div class="col"></div>
        <div class="col">
          <img src="../assets/台化logo.png" height="250" width="400" />
        </div>
        <div class="col"></div>
      </div>

      <form class="form-signin" @submit.prevent="login">
        <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
        <p v-show="showTishi" class="text-center text-danger">{{ tishi }}</p>
        <label for="inputID" class="sr-only">Notes ID</label>
        <input
          type="text"
          id="inputID"
          class="form-control"
          placeholder="Notes ID"
          v-model="username"
          required
          autofocus
        />
        <label for="inputPassword" class="sr-only">Password</label>
        <input
          type="password"
          id="inputPassword"
          class="form-control"
          v-model="password"
          placeholder="Password"
          required
        />
        <button class="btn btn-lg btn-primary btn-block" type="submit">
          登入
        </button>
      </form>

      <Footer />
    </div>
  </div>
</template>

<script>
import axios from "axios";

import { setCookie, getCookie, delCookie } from "../assets/js/cookie.js";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default {
  data() {
    return {
      username: "",
      password: "",
      tishi: "",
      showTishi: false,
    };
  },
  mounted() {
    if (getCookie("username")) {
      this.$router.push("/");
    }
  },
  methods: {
    login() {
      if (this.username == "" || this.password == "") {
        alert("請輸入NoteID或者密碼");
      } else {
        let data = {
          username: this.username,
          password: this.password,
        };
        axios.post("/api/login", data).then((res) => {
          if (res.data == -1) {
            this.tishi = " 該使用者不存在";
            this.showTishi = true;
          } else if (res.data == 0) {
            this.tishi = "密碼輸入錯誤";
            this.showTishi = true;
          } else if (res.data == "admin") {
            setCookie("username", this.username, 1000 * 60);
            this.$router.push("/user");
          } else {
            this.tishi = "登入成功";
            this.showTishi = true;
            setCookie("username", this.username, 1000 * 60);
            setTimeout(
              function () {
                this.$router.push("/");
              }.bind(this),
              1
            );
          }
        });
      }
    },
  },
  components: {
    Navbar,
    Footer,
  },
};
</script>

<style scoped>
html,
body {
  height: 100%;
}
body {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>