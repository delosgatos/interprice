import Vue from 'vue';
import VueRouter from 'vue-router';
import App from '@/App';
import routes from '@/routes';

import vuetify from '@/plugins/vuetify';

import moment from 'moment';
Vue.filter('shortWordDate', function(value) {
  if (value) {
    return moment(parseInt(value)).format('DD-MMM-YY')
  }
});

Vue.config.productionTip = false;

Vue.use(VueRouter);

const router = new VueRouter({
    routes,
    linkActiveClass: 'active',
    mode: 'history'
});

new Vue({
    el: '#app',
    vuetify,
    render: h => h(App),
    router
});