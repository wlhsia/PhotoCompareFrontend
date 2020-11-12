<template>
  <div>
    <Navbar />
    <div class="container-fluid">
      <div class="row">
        <Sidebar />
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <h3>管理相片資料庫</h3>
          <br />
          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              placeholder="搜尋相片名稱"
              v-model="search"
            />
          </div>
          <br />
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">相片名稱</th>
                <th scope="col">上傳人員</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in filteredImgList" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.imageName }}</td>
                <td>{{ item.uploadUser }}</td>
                <td>
                  <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    @click="deleteImage(item.imageName)"
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
      imgList: [],
      search: "",
    };
  },
  created() {
    let uname = getCookie("username");
    if (uname == "") {
      this.$router.push("/login");
    } else if (uname != "admin") {
      this.$router.push("/uploadrecord");
    }
  },
  mounted() {
    this.getImageList();
  },
  methods: {
    getImageList() {
      axios.get("/api/imgs").then((res) => {
        this.imgList = res.data.images;
      });
    },
    deleteImage(imgName) {
      axios.delete(`/api/delimg/${imgName}`).then((res) => {
        console.log(res);
      });
      this.getImageList();
    },
  },
  computed: {
    filteredImgList: function () {
      if (this.search != "") {
        let r = RegExp("^" + this.search, "i");
        let newImgList = [];
        this.imgList.forEach((item, index) => {
          if (r.test(item["imageName"])) {
            newImgList.push(item);
          }
        });
        return newImgList;
      }else{
        return this.imgList
      }
      
    },
  },
  components: {
    Navbar,
    Sidebar,
    Footer,
  },
};
</script>