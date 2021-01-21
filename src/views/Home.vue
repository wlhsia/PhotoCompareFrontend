  
 <template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <Navbar />
    <div class="container">
      <div class="jumbotron">
        <p class="lead text-danger">
          上傳檔案注意事項：
          <br />(1)檔案類型須為.docx, .xlsx, .pdf
          <br />(2)檔名勿使用中文及'~'符號
          <br />(3)檔名須為「工程編號(8碼英文數字)_公司代號(4,
          RV)_檔案名稱(無限制)+附檔名(.docx, .xlsx, .pdf)」
          <br />&emsp;&emsp;例如：「ABCD1234_4_001-006.docx」或「ABCD1234_RV_001-006.pdf」
          <br />(4)上傳PDF檔案相片須為正面朝上或正面朝右
        </p>
      </div>
      <div class="alert alert-danger" role="alert" v-if="alert.length > 0">
        {{ alert }}
      </div>
      <input id="file" type="file" />
      <br />
      <br />
      <button
        class="btn btn-primary"
        @click="upload"
        :disabled="fileList.length != 0"
      >
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
                :disabled="imgsNum != 0"
              >
                刪除
              </button>
            </h3>
          </td>
        </tr>
      </table>
      <button
        class="btn btn-primary"
        id="compare"
        @click="getImg()"
        :disabled="fileList.length == 0 || imgsNum != 0"
      >
        <h3>擷取上傳檔案相片</h3></button
      >&emsp;<button
        :disabled="imgsNum == 0"
        id="compare"
        class="btn btn-primary"
        @click="compare()"
      >
        <h3>相片重複比對</h3>
      </button>
      <br />
      <br />
      <h3>上傳相片數：{{ imgsNum }}&emsp;重複相片數：{{ duplicateImgsNum }}</h3>
      <br />
      <div v-if="nonDuplicateImgsData.length !== 0">
        <h3 class="text-danger">{{ message }}</h3>
        <button
          class="btn btn-danger"
          @click="openDBModal"
          v-if="nonDuplicateImgsData.length !== 0"
        >
          <h3>是</h3>
        </button>
      </div>
      <br />
      <div v-if="isDownloadShow">
        <h3>下載比對結果</h3>
        <a href="" @click.prevent="download"
          ><h3>{{ resultFileName }}</h3></a
        >
      </div>
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
              <img :src="`static/resize_imgs/${item.imgName1}`" alt="" />
            </td>
            <td>
              {{ item.imgName2 }}
            </td>
            <td>
              <img :src="`static/resize_imgs/${item.imgName2}`" alt="" />
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
              <img :src="`static/resize_imgs/${item.imgName1}`" alt="" />
            </td>
            <td>
              {{ item.imgName2 }}
            </td>
            <td>
              <img :src="`static/resize_imgs/${item.imgName2}`" alt="" />
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
            <h5 class="modal-title">提示</h5>
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
            <button type="button" class="btn btn-primary" @click="updateDB">
              確定
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
import Agent from "agentkeepalive";
import http from "http";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import { setCookie, getCookie, delCookie } from "../assets/js/cookie.js";
export default {
  name: "",
  data() {
    return {
      isLoading: false,
      isDownloadShow: false,
      fileList: [],
      folderPath: "",
      imgsPath: "",
      result1: [],
      result2: [],
      message: "",
      nonDuplicateImgsData: [],
      alert: "",
      imgsNum: 0,
      duplicateImgsNum: 0,
    };
  },
  methods: {
    openDBModal() {
      $("#dbModal").modal("show");
    },
    logout() {
      delCookie("username");
      this.$router.push("/login");
    },
    upload() {
      this.isLoading = true;
      this.alert = "";
      this.result1 = [];
      this.result2 = [];
      this.imgsNum = 0;
      this.duplicateImgsNum = 0;
      this.message = [];
      this.nonDuplicateImgsData = [];
      this.isDownloadShow = false;
      let data = new FormData();
      const re = /^.{8}_[A-Z\d]{1,2}_.+(.docx|.xlsx|.pdf)$/;
      let isMeet = false;
      for (var i = 0; i < document.getElementById("file").files.length; i++) {
        const input = document.getElementById("file").files[i].name;
        if (re.test(input)) {
          data.append(`file${i}`, document.getElementById("file").files[i]);
          isMeet = true;
        } else {
          this.alert = "檔名不符合";
          isMeet = false;
          this.isLoading = false;
          break;
        }
      }
      if (isMeet) {
        data.append("username", this.name);
        axios
          .post("/api/upload", data)
          .then((response) => {
            this.folderPath = response.data.folderPath;
            this.uploadList();
            this.isLoading = false;
          })
          .catch((err) => {
            this.alert = "檔案上傳失敗請重試";
            this.isLoading = false;
          });
      }
    },
    deleteFile(file) {
      this.isLoading = true;
      let data = {
        file: file,
        folderPath: this.folderPath,
      };
      axios.post("/api/delete", data).then((response) => {
        this.uploadList();
        this.isLoading = false;
      });
    },
    uploadList() {
      let data = {
        folderPath: this.folderPath,
      };
      axios.post("/api/getlist", data).then((response) => {
        this.fileList = response.data.fileList;
      });
    },
    getImg() {
      this.isLoading = true;
      let data = {
        folderPath: this.folderPath,
      };
      axios
        .post("/api/getImg", data)
        .then((response) => {
          this.imgsNum = response.data.imgsNum;
          this.imgsPath = response.data.imgsPath;
          this.isLoading = false;
        })
        .catch((err) => {
          this.alert = "擷取相片失敗請重試";
          this.isLoading = false;
        });
    },
    compare() {
      this.isLoading = true;
      let data = {
        username: this.name,
        fileList: this.fileList,
        folderPath: this.folderPath,
        imgsPath: this.imgsPath,
      };
      const httpAgent = new http.Agent({ keepAlive: true });
      axios
        .post("/api/compare", data, { httpAgent })
        .then((response) => {
          this.result1 = response.data.result1;
          this.result2 = response.data.result2;
          this.duplicateImgsNum = response.data.duplicateImgsNum;
          this.message = response.data.message;
          this.nonDuplicateImgsData = response.data.nonDuplicateImgsData;
          this.resultFileName = response.data.resultFileName;
          if (this.nonDuplicateImgsData.length == 0) {
            this.isDownloadShow = true;
          }
          this.uploadList();
          this.isLoading = false;
        })
        .catch((err) => {
          this.alert = "重複比對失敗請重試";
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
        if (navigator.appVersion.toString().indexOf(".NET") > 0) {
          window.navigator.msSaveBlob(
            new Blob([response.data]),
            "比對結果.xlsx"
          );
          this.isLoading = false;
        } else {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "比對結果.xlsx");
          document.body.appendChild(link);
          link.click();
          this.isLoading = false;
        }
      });
    },
    updateDB() {
      $("#dbModal").modal("hide");
      this.isLoading = true;
      let data = {
        imgsData: this.nonDuplicateImgsData,
        username: this.name,
      };
      axios.post("/api/updatedb", data).then((response) => {
        this.isDownloadShow = true;
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