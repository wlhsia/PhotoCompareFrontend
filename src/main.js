import Vue from 'vue'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.min.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faPhoneSquareAlt, faUsers, faImages, faFileUpload, faThList } from '@fortawesome/free-solid-svg-icons'
import { faPython } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import App from './App.vue'
import router from './router'
import store from './store'


library.add(faPhoneSquareAlt, faUser, faPython, faUsers, faImages, faFileUpload, faThList)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('Loading', Loading);
Vue.config.productionTip = false


new Vue({
  router,
  store,

  render: h => h(App)
}).$mount('#app')
