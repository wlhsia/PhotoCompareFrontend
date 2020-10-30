<template>
  <div>
    <Navbar />
    <div class="container-fluid">
      <div class="row">
        <Sidebar />
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <h3>管理使用者</h3>
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
                <th scope="col">NotesID</th>
                <th scope="col">密碼</th>
                <th scope="col">備註</th>
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
                <td>{{ item.remark }}</td>
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
                    @click="deleteUser(item.username)"
                  >
                    刪除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </main>
      </div>
    </div>
    <!-- updateModal -->
    <div
      class="modal fade"
      id="updateModal"
      tabindex="-1"
      aria-labelledby="updateModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 v-if="isNew" class="modal-title" id="updateModalLabel">
              新增使用者
            </h5>
            <h5 v-else class="modal-title" id="updateModalLabel">修改使用者</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="id" class="col-form-label">NoteID</label>
                <input
                  type="text"
                  class="form-control"
                  name="id"
                  id="id"
                  v-model="tempUser.username"
                  placeholder="請輸入NoteID"
                />
              </div>
              <div class="form-group">
                <label for="pwd" class="col-form-label">密碼</label>
                <input
                  type="text"
                  class="form-control"
                  name="pwd"
                  id="pwd"
                  v-model="tempUser.password"
                  placeholder="請輸入密碼"
                />
              </div>
              <div class="form-group">
                <label for="remark" class="col-form-label">備註</label>
                <input
                  type="text"
                  class="form-control"
                  name="remark"
                  id="remark"
                  v-model="tempUser.remark"
                  placeholder="請輸入備註"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              關閉
            </button>
            <button type="button" class="btn btn-primary" @click="updateUser">
              確認
            </button>
          </div>
        </div>
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
      isNew: false,
      userList: [],
      tempUser: {},
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
    this.getUserList();
  },
  methods: {
    openUpdateModal(isNew, item) {
      if (isNew) {
        this.tempUser = {};
        this.isNew = true;
      } else {
        this.tempUser = Object.assign({}, item);
        this.isNew = false;
      }
      $("#updateModal").modal("show");
    },
    getUserList() {
      axios.get("/api/users").then((res) => {
        this.userList = res.data.users;
      });
    },
    updateUser() {
      if (this.isNew) {
        axios.post("/api/users", this.tempUser).then((res) => {
          console.log(res.data.message);
        });
      } else {
        axios
          .put(`/api/user/${this.tempUser.username}`, this.tempUser)
          .then((res) => {
            console.log(res.data.message);
          });
      }
      this.getUserList();
      $("#updateModal").modal("hide");
    },
    deleteUser(username) {
      axios.delete(`/api/user/${username}`).then((res) => {
        console.log(res.data.message);
      });
      this.getUserList();
    },
  },
  components: {
    Navbar,
    Sidebar,
    Footer,
  },
};
</script>