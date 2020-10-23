<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <Navbar />
    <div class="container">
      <div class="jumbotron">
        <p class="lead text-danger">
          上傳檔案注意事項：
          <br />(1)檔名須為「工程編號(8碼英文數字)_公司代號(1碼數字)_檔案名稱(無限制)+附檔名(.docx或.pdf)」
          <br />&emsp;&emsp;例如：「ABCD1234_4_001~006.docx」或「ABCD1234_4_001~006.pdf」
          <br />(2)上傳PDF檔案相片須為正面朝上或正面朝右
        </p>
      </div>
      <input id="file" multiple type="file" :disabled="!isDisabled" />
      <br />
      <br />
      <button :disabled="!isDisabled" class="btn btn-primary" @click="upload">
        <h3>上傳施工相片檔案</h3>
      </button>
      <br />
      <br />
      <h3>已上傳的檔案</h3>
      <table class="table">
        <tr v-for="(file, index) in fileList" :key="index">
          <td>
            <h3>{{ file }}</h3>
          </td>
          <td>
            <h3>
              <button
                type="button"
                class="btn btn-danger"
                @click="deleteFile(file)"
              >
                刪除
              </button>
            </h3>
          </td>
        </tr>
      </table>
      <button
        :disabled="isDisabled"
        id="compare"
        class="btn btn-primary"
        @click="compare()"
      >
        <h3>比對施工相片</h3>
      </button>
      <br />
      <br />
      <div>
        <h3 class="text-danger">{{ message[0] }}</h3>
        <h3 class="text-danger">{{ message[1] }}</h3>
        <button class="btn btn-danger" @click="openDBModal" v-if="nonDuplicateImgs.length !==0 "><h3>是</h3></button>
      </div>
      <br />
      <a href="" @click.prevent="download"><h3>下載比對結果</h3></a>
      <br />
      <table class="table table-striped table-hover" v-show="isTableShow">
        <thead class="thead-dark text-center">
          <th colspan="2"><h3>相片(一)</h3></th>
          <th colspan="2"><h3>相片(二)</h3></th>
        </thead>
        <tbody>
          <tr class="text-center" v-show="result1.length !== 0">
            <td colspan="2"><h3>上傳的相片</h3></td>
            <td colspan="2"><h3>上傳的相片</h3></td>
          </tr>
          <tr v-for="(item, index) in result1" :key="index">
            <td>
              {{ item.imgName1 }}
            </td>
            <td>
              <img
                :src="require(`../../../backend/resize_imgs/${item.imgName1}`)"
                alt=""
              />
            </td>
            <td>
              {{ item.imgName2 }}
            </td>
            <td>
              <img
                :src="require(`../../../backend/resize_imgs/${item.imgName2}`)"
                alt=""
              />
            </td>
          </tr>
          <tr class="text-center" v-if="result2.length !== 0">
            <td colspan="2"><h3>上傳的相片</h3></td>
            <td colspan="2"><h3>資料庫的相片</h3></td>
          </tr>
          <tr v-for="(item, index) in result2" :key="index">
            <td>
              {{ item.imgName1 }}
            </td>
            <td>
              <img
                :src="require(`../../../backend/resize_imgs/${item.imgName1}`)"
                alt=""
              />
            </td>
            <td>
              {{ item.imgName2 }}
            </td>
            <td>
              <img
                :src="require(`../../../backend/resize_imgs/${item.imgName2}`)"
                alt=""
              />
            </td>
          </tr>
        </tbody>
      </table>
      <Footer />
    </div>
    <!-- modal -->
    <div class="modal" tabindex="-1" id="dbModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modal title</h5>
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
            <p>確認要將相片存入資料庫</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              取消
            </button>
            <button type="button" class="btn btn-primary" @click="updateDB">確定</button>
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
import Footer from "@/components/Footer.vue";
import { getCookie, delCookie } from "../assets/js/cookie";

export default {
  name: "",
  data() {
    return {
      isLoading: false,
      fileList: [],
      folderPath: "",
      result1: [],
      result2: [],
      message: [],
      nonDuplicateImgs: [],
    };
  },
  methods: {
    openDBModal(){
      $("#dbModal").modal("show");
    },
    logout() {
      delCookie("username");
      this.$router.push("/login");
    },
    upload() {
      this.isLoading = true;
      this.result1 = [];
      this.result2 = [];
      this.message = [];
      var data = new FormData();
      for (var i = 0; i < document.getElementById("file").files.length; i++) {
        data.append(`file${i}`, document.getElementById("file").files[i]);
      }
      axios.post("/api/api/upload", data).then((response) => {
        // console.log(response.data);
        this.folderPath = response.data.folderPath;
        this.uploadList();
        this.isLoading = false;
      });
    },
    deleteFile(file) {
      this.isLoading = true;
      let data = {
        file: file,
        folderPath: this.folderPath,
      };
      axios.post("/api/api/delete", data).then((response) => {
        // console.log(response);
        this.uploadList();
        this.isLoading = false;
      });
    },
    uploadList() {
      let data = {
        folderPath: this.folderPath,
      };
      axios.post("/api/api/getlist", data).then((response) => {
        // console.log(response);
        this.fileList = response.data.fileList;
      });
    },
    compare() {
      this.isLoading = true;
      let data = {
        folderPath: this.folderPath,
      };
      axios.post("/api/api/compare", data).then((response) => {
        // console.log(response);
        this.result1 = response.data.result1;
        this.result2 = response.data.result2;
        this.message = response.data.message;
        this.nonDuplicateImgs = response.data.nonDuplicateImgs;
        this.resultFileName = response.data.resultFileName;
        this.uploadList();
        this.isLoading = false;
      });
    },
    download() {
      this.isLoading = true;
      axios({
        url: "api/download",
        method: "POST",
        data: {
          resultFileName: this.resultFileName,
        },
        responseType: "blob",
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "比對結果.xlsx");
        document.body.appendChild(link);
        link.click();
        this.isLoading = false;
      });
    },
    updateDB() {
      $("#dbModal").modal("hide");
      this.isLoading = true;
      let data={
        imgs: this.nonDuplicateImgs
      }
      axios.post("/api/updatedb", data).then((response) => {
        this.isLoading = false;
      });
    },
  },
  computed: {
    isDisabled() {
      if (this.fileList.length == 0) {
        return true;
      } else {
        return false;
      }
    },
    isTableShow() {
      if (this.result1.length !== 0 || this.result2.length !== 0) {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    let uname = getCookie("username");
    this.name = uname;
    console.log(uname);
    if (uname == "") {
      this.$router.push("/login");
    }
  },
  components: {
    Navbar,
    Footer,
  },
};
</script>