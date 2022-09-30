//import '@babel/polyfill'
//import 'mutationobserver-shim'
//import Vue from 'vue'
//import './plugins/bootstrap-vue'
//import App from './App.vue'
const Vue=require('vue')
const App=require('./App.vue')
Vue.config.productionTip = false;
//import '../node_modules/leaflet/dist/leaflet.css';
//import './style.css';
new Vue({
  render: h => h(App),
}).$mount('#app');
