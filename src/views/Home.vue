<template>
  <div>
    <div
      class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm"
    >
      <h1 class="my-0 mr-md-auto font-weight-normal text-center"></h1>
      <a class="btn btn-outline-primary">登出</a>
    </div>
    <div class="container">
      <div class="jumbotron">
        <h1 class="display-4">施工相片重複比對系統</h1>
        <hr class="my-4" />
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
        <h3>上傳施工相片檔案(docx,pdf)</h3>
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
    </div>
    <div class="container">
      <table class="table table-striped table-hover" v-show="isTableShow">
        <thead class="thead-dark text-center">
          <th colspan="2"><h3>相片(一)</h3></th>
          <th colspan="2"><h3>相片(二)</h3></th>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredResult" :key="index">
            <td>
              {{ item.imgName1 }}
            </td>
            <td>
              <img :src="item.imgUrl1" alt="" />
            </td>
            <td>
              {{ item.imgName2 }}
            </td>
            <td>
              <img :src="item.imgUrl2" alt="" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="container">
      <footer class="pt-4 my-md-5 pt-md-5 border-top text-right">
        <h5><font-awesome-icon :icon="['fab', 'python']" /> 程式人員</h5>
        <p>
          <font-awesome-icon icon="user" /> 夏唯倫<br /><font-awesome-icon
            icon="phone-square-alt"
          />
          400-6529
        </p>
      </footer>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";

export default {
  name: "",
  data() {
    return {
      fileList: [],
      folderPath: "",
      result: [],
    };
  },
  methods: {
    upload() {
      this.result=[];
      var data = new FormData();
      for (var i = 0; i < document.getElementById("file").files.length; i++) {
        data.append(`file${i}`, document.getElementById("file").files[i]);
      }
      axios.post("/api/api/upload", data).then((response) => {
        console.log(response.data);
        this.folderPath = response.data.folderPath;
        this.uploadList();
      });
      // $("#file").outerHTML = file.outerHTML;
    },
    deleteFile(file) {
      let data = {
        file: file,
        folderPath: this.folderPath,
      };
      axios.post("/api/api/delete", data).then((response) => {
        console.log(response);
        this.uploadList();
      });
    },
    uploadList() {
      let data = {
        folderPath: this.folderPath,
      };
      axios.post("/api/api/getlist", data).then((response) => {
        console.log(response);
        this.fileList = response.data.fileList;
      });
    },
    compare() {
      let data = {
        folderPath: this.folderPath,
      };
      axios.post("/api/api/compare", data).then((response) => {
        console.log(response);
        this.result = response.data.result;
        this.uploadList();
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
      if (this.result.length === 0) {
        console.log(this.result.length);
        return false;
      } else {
        return true;
      }
    },
    filteredResult() {
      var newResult = [];
      this.result.forEach((item) => {
        item[
          "imgUrl1"
        ] = require(`../../../backend/resize_imgs/${item.imgName1}`);
        item[
          "imgUrl2"
        ] = require(`../../../backend/resize_imgs/${item.imgName2}`);
        newResult.push(item);
      });
      return newResult;
    },
  },
  created() {
    // this.uploadList()
  },
};
</script>