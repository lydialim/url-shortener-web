import Vue from 'vue'
import App from './App.vue'
import VueMaterial from 'vue-material';
import VueClipboard from 'vue-clipboard2'
import axios from 'axios';

Vue.use(VueMaterial)
Vue.use(VueClipboard);

Vue.material.registerTheme('default', {
  primary: 'blue',
})

new Vue({
  el: '#app',
  render: h => h(App)
})
