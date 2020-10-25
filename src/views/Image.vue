<template>
  <div>
    <Navbar />
    <div class="container-fluid">
      <div class="row">
        <Sidebar />
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <h3>管理相片資料庫</h3>
          <br />
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
              <tr
                v-for="(item, index) in imgList"
                :key="index"
              >
                <td>{{ index+1 }}</td>
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
import { getCookie, delCookie } from "../assets/js/cookie";

export default {
  data() {
    return {
      imgList: [],
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
        console.log(res)
      });
      this.getImageList()
    },
  },
  components: {
    Navbar,
    Sidebar,
    Footer,
  },
};
</script>