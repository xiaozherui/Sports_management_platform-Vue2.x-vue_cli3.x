import Vue from 'vue'
import App from './App.vue'
import router from './router'
//导入axios
import axios from 'axios'
import ElementUI from 'element-ui'
// 导入全局样式
import './assets/css/global.css'
// 导入iconfront
import './assets/font/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'
//挂载axios
Vue.prototype.$http = axios
// 设置请求的根路径(后端项目路径)
axios.defaults.baseURL = "http://localhost:9000/"

axios.interceptors.request.use(config => {
  console.log(config);
  // 请求头挂载信息
  config.headers.Authorization = window.sessionStorage.getItem("flag");
  // 在最后必须return config
  return config;
})

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
