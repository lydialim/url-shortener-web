import Vue from 'vue'
import App from './App.vue'
import VueMaterial from 'vue-material';
import VueClipboard from 'vue-clipboard2'
import moment from 'moment';

Vue.use(VueMaterial)
Vue.use(VueClipboard);

Vue.material.registerTheme('default', {
  primary: 'blue'
})

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('lll')
  }
});

new Vue({
  el: '#app',
  render: h => h(App)
})
