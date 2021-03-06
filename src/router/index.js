import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import User from '../views/User.vue'
import Image from '../views/Image.vue'
import UploadRecord from '../views/UploadRecord.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/bolt',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/user',
    name: 'user',
    component: User
  },
  {
    path: '/image',
    name: 'image',
    component: Image
  },
  {
    path: '/uploadrecord',
    name: 'uploadrecord',
    component: UploadRecord
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
